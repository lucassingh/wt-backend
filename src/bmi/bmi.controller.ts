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
import { BmiService } from './bmi.service';
import { CreateBmiDto } from './dto/create-bmi.dto';
import { UpdateBmiDto } from './dto/update-bmi.dto';

@ApiTags('bmi')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bmi')
export class BmiController {
  constructor(private readonly bmiService: BmiService) {}

  @Post()
  @ApiOperation({ summary: 'Create a BMI record (calculates IMC and category)' })
  create(@CurrentUser() user: User, @Body() dto: CreateBmiDto) {
    return this.bmiService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all BMI records for the current user, ordered by date desc' })
  findAll(@CurrentUser() user: User) {
    return this.bmiService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single BMI record by id' })
  findOne(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.bmiService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a BMI record (recalculates IMC and category)' })
  update(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBmiDto,
  ) {
    return this.bmiService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a BMI record' })
  remove(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.bmiService.remove(id, user.id);
  }
}
