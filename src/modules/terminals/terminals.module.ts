import { Module } from '@nestjs/common';
import { TerminalsService } from './service/terminals.service';
import { TerminalsController } from './controller/terminals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Terminal } from './entity/terminal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Terminal])],
  controllers: [TerminalsController],
  providers: [TerminalsService],
  exports: [TerminalsService],
})
export class TerminalsModule {}
