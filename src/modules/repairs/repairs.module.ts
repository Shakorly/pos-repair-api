import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairsService } from '../repairs/service/repairs.service';
import { RepairsController } from '../repairs/controller/repair.controller';
import { Repair } from './entities/repair.entity';
import { Terminal } from '../terminals/entity/terminal.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Repair, // Main entity
      Terminal, // Needed to verify terminal exists
      User,
    ]),
  ],
  controllers: [RepairsController],
  providers: [RepairsService],
  exports: [RepairsService], // For future modules
})
export class RepairsModule {}
