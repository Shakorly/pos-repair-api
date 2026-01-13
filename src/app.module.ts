import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TerminalsModule } from './modules/terminals/terminals.module';
import { Terminal } from './modules/terminals/entity/terminal.entity';
import { Repair } from './modules/repairs/entities/repair.entity';
import { RepairsModule } from './modules/repairs/repairs.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Terminal, Repair],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: true,
      }),
    }),
    UsersModule,
    AuthModule,
    TerminalsModule,
    RepairsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
