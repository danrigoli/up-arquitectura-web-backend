import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Unique } from './validators/unique.validator';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        namingStrategy: new SnakeNamingStrategy(),
        entities: ['src/**/*.entity.{ts,js}'],
        migrations: ['src/database/migrations/*.{ts,js}'],
        migrationsTableName: 'typeorm_migrations',
        autoLoadEntities: true,
        synchronize: false,
        connectTimeoutMS: 10_000,
        maxQueryExecutionTime: 30_000,
        poolSize: 200,
        extra: {
          poolSize: 200,
          connectionTimeoutMillis: 3000,
          query_timeout: 30_000,
          statement_timeout: 30_000,
        },
      }),
    }),
  ],
  providers: [Unique],
})
export class DatabaseModule {}
