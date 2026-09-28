import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user/schema/user.schema.js';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './user/dto/register.dto.js';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './user/dto/login.dto.js';
import { JwtPayload } from './strategies/jwt.strategies.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Helper function to generate access and refresh tokens.
   */
  private async getTokens(
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
  ) {
    const payload: JwtPayload = {
      sub: userId,
      email,
      firstName,
      lastName,
      phoneNumber,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET as string,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET as string,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Hashes and saves the refresh token into the user document.
   */
  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.userModel
      .findByIdAndUpdate(userId, { refreshTokenHash: hash })
      .exec();
  }

  /**
   * Registers a new user with a hashed password.
   *
   * @param dto - User registration payload.
   * @returns A promise that resolves to the created user (excluding passwordHash).
   * @throws {@link ConflictException} If email is already in use.
   */
  async register(dto: RegisterDto) {
    const existingUser = await this.userModel
      .findOne({ email: dto.email.toLowerCase() })
      .exec();
    if (existingUser) {
      throw new ConflictException('User with this email id already exists.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const newUser = new this.userModel({
      email: dto.email.toLowerCase(),
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
      password: passwordHash,
    });

    await newUser.save();

    const { password, ...user } = newUser.toObject();

    return user;
  }

  /**
   * Authenticates user credentials and returns a signed JWT.
   *
   * @param dto - Login credentials payload.
   * @returns A promise that resolves to the user object and access token.
   * @throws {@link UnauthorizedException} If email or password is incorrect.
   */
  async login(dto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: dto.email.toLowerCase() })
      .exec();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const tokens = await this.getTokens(
      user._id.toString(),
      user.email,
      user.firstName,
      user.lastName,
      user.phoneNumber,
    );

    await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);

    const { password, ...userObj } = user.toObject();

    return {
      user: userObj,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Validates refresh token against database hash and issues a new token pair (Rotation).
   */
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user || !user.refreshTokenHash) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(
      user._id.toString(),
      user.email,
      user.firstName,
      user.lastName,
      user.phoneNumber,
    );
    await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);

    return tokens;
  }

  /**
   * Clears user refresh token hash on logout.
   */
  async logout(userId: string) {
    await this.userModel
      .findByIdAndUpdate(userId, { refreshTokenHash: null })
      .exec();
  }
}
