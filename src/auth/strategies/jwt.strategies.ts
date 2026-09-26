import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from '../user/schema/user.schema.js';
import { Model } from 'mongoose'
import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. Check Bearer Token in Header (Mobile/API client path)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // 2. Check Cookie (Web browser path)
        (request: Request) => {
          return request?.cookies?.access_token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  /**
   * Validates the token payload and attaches the user document to req.user.
   *
   * @param payload - Decoded JWT payload.
   * @returns A promise that resolves to the authenticated user.
   * @throws {@link UnauthorizedException} If user no longer exists.
   */
  async validate(payload: JwtPayload) {
    const user = await this.userModel.findById(payload.sub);

    if (!user) {
      return null;
    }

    return user
  }
}
