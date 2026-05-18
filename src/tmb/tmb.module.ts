import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTmb } from './entities/tmb.entity';
import { TmbController } from './tmb.controller';
import { TmbService } from './tmb.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserTmb])],
  controllers: [TmbController],
  providers: [TmbService],
})
export class TmbModule {}
