import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateTmbDto } from './dto/create-tmb.dto';
import { UpdateTmbDto } from './dto/update-tmb.dto';
import { TmbService } from './tmb.service';

@ApiTags('tmb')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tmb')
export class TmbController {
  constructor(private readonly tmbService: TmbService) {}

  @Post()
  @ApiOperation({ summary: 'Create a TMB calculation record' })
  create(@CurrentUser() user: User, @Body() dto: CreateTmbDto) {
    return this.tmbService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all TMB records for the current user, ordered by date desc' })
  findAll(@CurrentUser() user: User) {
    return this.tmbService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single TMB record by id' })
  findOne(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.tmbService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a TMB record (recalculates BMR and TDEE)' })
  update(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTmbDto,
  ) {
    return this.tmbService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a TMB record' })
  remove(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.tmbService.remove(id, user.id);
  }
}
