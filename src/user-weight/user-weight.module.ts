import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWeight } from './entities/user-weight.entity';
import { UserWeightController } from './user-weight.controller';
import { UserWeightService } from './user-weight.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserWeight])],
  controllers: [UserWeightController],
  providers: [UserWeightService],
})
export class UserWeightModule {}
