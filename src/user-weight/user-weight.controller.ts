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
import { CreateUserWeightDto } from './dto/create-user-weight.dto';
import { UpdateUserWeightDto } from './dto/update-user-weight.dto';
import { UserWeightService } from './user-weight.service';

@ApiTags('user-weight')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user-weight')
export class UserWeightController {
  constructor(private readonly userWeightService: UserWeightService) {}

  @Post()
  @ApiOperation({ summary: 'Log a new weight entry' })
  create(@CurrentUser() user: User, @Body() dto: CreateUserWeightDto) {
    return this.userWeightService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all weight entries for the current user, ordered by date desc' })
  findAll(@CurrentUser() user: User) {
    return this.userWeightService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single weight entry by id' })
  findOne(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.userWeightService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a weight entry' })
  update(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserWeightDto,
  ) {
    return this.userWeightService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a weight entry' })
  remove(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.userWeightService.remove(id, user.id);
  }
}
