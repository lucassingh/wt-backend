import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BmiController } from './bmi.controller';
import { BmiService } from './bmi.service';
import { UserBmi } from './entities/bmi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserBmi])],
  controllers: [BmiController],
  providers: [BmiService],
})
export class BmiModule {}
