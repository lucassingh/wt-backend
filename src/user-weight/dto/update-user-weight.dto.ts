import { PartialType } from '@nestjs/swagger';
import { CreateUserWeightDto } from './create-user-weight.dto';

export class UpdateUserWeightDto extends PartialType(CreateUserWeightDto) {}
