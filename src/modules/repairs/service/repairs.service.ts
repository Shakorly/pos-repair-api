import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Repair } from '../entities/repair.entity';
import { Terminal } from '../../terminals/entity/terminal.entity';
import { User } from '../../users/entities/user.entity';
import { CreateRepairDto, UpdateRepairDto } from '../dto';
import { RepairStatus } from '../../../common/enums';

@Injectable()
export class RepairsService {
  // Define valid status transitions
  private readonly VALID_TRANSITIONS: Record<RepairStatus, RepairStatus[]> = {
    [RepairStatus.PENDING_ACCEPTANCE]: [
      RepairStatus.AWAITING_REPAIR, // Tech accepts
    ],
    [RepairStatus.AWAITING_REPAIR]: [
      RepairStatus.IN_REPAIR, // Tech starts work
      RepairStatus.HARD_TO_FIX, // Tech marks difficult
    ],
    [RepairStatus.IN_REPAIR]: [
      RepairStatus.PENDING_QA, // Tech completes repair
      RepairStatus.HARD_TO_FIX, // Tech gives up
    ],
    [RepairStatus.HARD_TO_FIX]: [
      RepairStatus.IN_REPAIR, // Inventory reassigns, tech tries again
    ],
    [RepairStatus.PENDING_QA]: [
      RepairStatus.QA_APPROVED, // QA passes
      RepairStatus.QA_REJECTED, // QA fails
    ],
    [RepairStatus.QA_REJECTED]: [
      RepairStatus.IN_REPAIR, // Tech fixes issues
    ],
    [RepairStatus.QA_APPROVED]: [
      RepairStatus.COMPLETED, // Final state
    ],
    [RepairStatus.COMPLETED]: [], // No transitions from completed
  };

  constructor(
    @InjectRepository(Repair)
    private repairsRepository: Repository<Repair>,
    @InjectRepository(Terminal)
    private terminalsRepository: Repository<Terminal>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Check if technician has reached 30 terminal limit
   */
  async getTechnicianActiveRepairCount(technicianId: string): Promise<number> {
    return this.repairsRepository.count({
      where: {
        assignedToId: technicianId,
        status: Not(RepairStatus.COMPLETED), // All statuses except completed
      },
    });
  }

  /**
   * Create new repair (called by Inventory Officer)
   */
  async create(
    createRepairDto: CreateRepairDto,
    assignedById: string, // From JWT token
  ): Promise<Repair> {
    // 1. Verify terminal exists
    const terminal = await this.terminalsRepository.findOne({
      where: { id: createRepairDto.terminalId },
    });
    if (!terminal) {
      throw new NotFoundException(
        `Terminal with ID "${createRepairDto.terminalId}" not found`,
      );
    }

    // 2. Verify assigned technician exists and is active
    const technician = await this.usersRepository.findOne({
      where: { id: createRepairDto.assignedToId, isActive: true },
    });
    if (!technician) {
      throw new NotFoundException(
        `Technician with ID "${createRepairDto.assignedToId}" not found or inactive`,
      );
    }

    // 3. Check 30 terminal limit (SOP rule!)
    const activeCount = await this.getTechnicianActiveRepairCount(
      createRepairDto.assignedToId,
    );
    if (activeCount >= 30) {
      throw new BadRequestException(
        `Technician "${technician.firstName} ${technician.lastName}" has reached the maximum limit of 30 active repairs`,
      );
    }

    // 4. Check repair code uniqueness
    try {
      const repair = this.repairsRepository.create({
        ...createRepairDto,
        assignedById,
        status: RepairStatus.PENDING_ACCEPTANCE,
        assignedAt: new Date(), // Timestamp when assigned
      });

      return await this.repairsRepository.save(repair);
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique constraint
        throw new ConflictException(
          `Repair with code "${createRepairDto.repairCode}" already exists`,
        );
      }
      throw new InternalServerErrorException('Failed to create repair');
    }
  }

  /**
   * Get all repairs with filters
   */
  async findAll(filters?: {
    status?: RepairStatus;
    assignedToId?: string;
    terminalId?: string;
  }): Promise<Repair[]> {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.assignedToId) where.assignedToId = filters.assignedToId;
    if (filters?.terminalId) where.terminalId = filters.terminalId;

    return this.repairsRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['assignedTo', 'assignedBy', 'qaOfficer'], // Load user details
    });
  }

  /**
   * Get single repair by ID
   */
  async findOne(id: string): Promise<Repair> {
    const repair = await this.repairsRepository.findOne({
      where: { id },
      relations: ['assignedTo', 'assignedBy', 'qaOfficer'],
    });

    if (!repair) {
      throw new NotFoundException(`Repair with ID "${id}" not found`);
    }

    return repair;
  }

  /**
   * Get repair by repair code
   */
  async findByRepairCode(repairCode: string): Promise<Repair> {
    const repair = await this.repairsRepository.findOne({
      where: { repairCode },
      relations: ['assignedTo', 'assignedBy', 'qaOfficer'],
    });

    if (!repair) {
      throw new NotFoundException(`Repair with code "${repairCode}" not found`);
    }

    return repair;
  }

  /**
   * Update repair (with status transition validation)
   */
  async update(id: string, updateRepairDto: UpdateRepairDto): Promise<Repair> {
    const repair = await this.findOne(id);

    // If status is being changed, validate transition
    if (updateRepairDto.status && updateRepairDto.status !== repair.status) {
      const validTransitions = this.VALID_TRANSITIONS[repair.status];

      if (!validTransitions.includes(updateRepairDto.status)) {
        throw new BadRequestException(
          `Invalid status transition from "${repair.status}" to "${updateRepairDto.status}". ` +
            `Valid transitions: ${validTransitions.join(', ')}`,
        );
      }

      // Update timestamps based on status change
      switch (updateRepairDto.status) {
        case RepairStatus.AWAITING_REPAIR:
          repair.acceptedAt = new Date();
          break;
        case RepairStatus.IN_REPAIR:
          if (!repair.startedAt) repair.startedAt = new Date();
          break;
        case RepairStatus.PENDING_QA:
          repair.completedAt = new Date();
          repair.pushedToQaAt = new Date();
          break;
        case RepairStatus.QA_APPROVED:
        case RepairStatus.QA_REJECTED:
          repair.qaCompletedAt = new Date();
          break;
        case RepairStatus.COMPLETED:
          if (!repair.completedAt) repair.completedAt = new Date();
          break;
      }
    }

    // Apply updates
    Object.assign(repair, updateRepairDto);

    return this.repairsRepository.save(repair);
  }

  /**
   * Delete repair (soft delete could be added later)
   */
  async remove(id: string): Promise<void> {
    const repair = await this.findOne(id);
    await this.repairsRepository.remove(repair);
  }

  /**
   * Get technician dashboard stats
   */
  async getTechnicianStats(technicianId: string) {
    const [pendingAcceptance, awaitingRepair, inRepair, pendingQa, total] =
      await Promise.all([
        this.repairsRepository.count({
          where: {
            assignedToId: technicianId,
            status: RepairStatus.PENDING_ACCEPTANCE,
          },
        }),
        this.repairsRepository.count({
          where: {
            assignedToId: technicianId,
            status: RepairStatus.AWAITING_REPAIR,
          },
        }),
        this.repairsRepository.count({
          where: { assignedToId: technicianId, status: RepairStatus.IN_REPAIR },
        }),
        this.repairsRepository.count({
          where: {
            assignedToId: technicianId,
            status: RepairStatus.PENDING_QA,
          },
        }),
        this.getTechnicianActiveRepairCount(technicianId),
      ]);

    return {
      pendingAcceptance,
      awaitingRepair,
      inRepair,
      pendingQa,
      total,
      remainingCapacity: 30 - total,
    };
  }
}
