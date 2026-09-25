import { PartialType } from '@nestjs/mapped-types'
import { CreateNewProjectsPlanDto } from "./create-new-projects-plan.dto.js";

export class UpdateNewProjectsPlanDto extends PartialType(CreateNewProjectsPlanDto) {}