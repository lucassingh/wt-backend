import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBmi } from '../bmi/entities/bmi.entity';
import { UserTmb } from '../tmb/entities/tmb.entity';
import { UserWeight } from '../user-weight/entities/user-weight.entity';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserWeight, UserBmi, UserTmb])],
  controllers: [SummaryController],
  providers: [SummaryService],
})
export class SummaryModule {}
