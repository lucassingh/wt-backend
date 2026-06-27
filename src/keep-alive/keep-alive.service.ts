import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class KeepAliveService {
  private readonly logger = new Logger(KeepAliveService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async pingDatabase() {
    try {
      await this.dataSource.query('SELECT 1');
      this.logger.log('DB keep-alive ping OK');
    } catch (error) {
      this.logger.error('DB keep-alive ping failed', error);
    }
  }
}
