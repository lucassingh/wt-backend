import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BmiModule } from './bmi/bmi.module';
import { KeepAliveModule } from './keep-alive/keep-alive.module';
import { SummaryModule } from './summary/summary.module';
import { TmbModule } from './tmb/tmb.module';
import { UserWeightModule } from './user-weight/user-weight.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'weight_tracker'),
        autoLoadEntities: true,
        // synchronize only in development — use migrations in production
        // DB_SYNC=true lets you force a sync on first production deploy; set to false afterwards
        synchronize:
          config.get<string>('NODE_ENV') !== 'production' ||
          config.get<string>('DB_SYNC') === 'true',
        logging: config.get<string>('NODE_ENV') === 'development',
        ssl:
          config.get<string>('DB_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    AuthModule,
    UsersModule,
    UserWeightModule,
    TmbModule,
    BmiModule,
    SummaryModule,
    KeepAliveModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
