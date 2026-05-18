import { PartialType } from '@nestjs/swagger';
import { CreateTmbDto } from './create-tmb.dto';

export class UpdateTmbDto extends PartialType(CreateTmbDto) {}
