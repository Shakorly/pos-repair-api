import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Terminal } from '../entity/terminal.entity';
import { CreateTerminalDto, UpdateTerminalDto } from '../dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TerminalsService {
  constructor(
    @InjectRepository(Terminal)
    private terminalsRepository: Repository<Terminal>,
  ) {}

  async create(createTerminalDto: CreateTerminalDto): Promise<Terminal> {
    try {
      const terminal = this.terminalsRepository.create(createTerminalDto);
      return await this.terminalsRepository.save(terminal);
    } catch (error) {
      // PostgreSQL unique constraint violation code
      if (error.code === '23505') {
        throw new ConflictException(
          `Terminal with serial number "${createTerminalDto.serialNumber}" already exists`,
        );
      }
      throw new InternalServerErrorException('Failed to create terminal');
    }
  }

  async findAll(): Promise<Terminal[]> {
    return this.terminalsRepository.find({
      order: {
        createdAt: 'DESC', // Newest first
      },
    });
  }

  async findOne(id: string): Promise<Terminal> {
    const terminal = await this.terminalsRepository.findOne({
      where: { id },
    });

    if (!terminal) {
      throw new NotFoundException(`Terminal with ID "${id}" not found`);
    }

    return terminal;
  }

  async findBySerialNumber(serialNumber: string): Promise<Terminal> {
    const terminal = await this.terminalsRepository.findOne({
      where: { serialNumber },
    });

    if (!terminal) {
      throw new NotFoundException(
        `Terminal with serial number "${serialNumber}" not found`,
      );
    }

    return terminal;
  }

  async update(
    id: string,
    updateTerminalDto: UpdateTerminalDto,
  ): Promise<Terminal> {
    const terminal = await this.findOne(id); // Throws if not found

    try {
      Object.assign(terminal, updateTerminalDto);
      return await this.terminalsRepository.save(terminal);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `Terminal with serial number "${updateTerminalDto.serialNumber}" already exists`,
        );
      }
      throw new InternalServerErrorException('Failed to update terminal');
    }
  }

  async remove(id: string): Promise<void> {
    const terminal = await this.findOne(id);
    await this.terminalsRepository.remove(terminal);
  }
}
