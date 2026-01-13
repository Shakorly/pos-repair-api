import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RepairsService } from '../../repairs/service/repairs.service';
import { CreateRepairDto, UpdateRepairDto } from '../dto';
import { RepairStatus } from '../../../common/enums';


@Controller('repairs')
export class RepairsController {
  constructor(private readonly repairsService: RepairsService) {}

  /**
   * Create new repair (Inventory Officer)
   * TODO: Add JWT guard to get assignedById from token
   */
  @Post()
  create(
    @Body() createRepairDto: CreateRepairDto,
    // @Request() req, // Will use this later to get user from JWT
  ) {
    // TEMPORARY: Hardcode assignedById for testing
    // In production, this comes from JWT token
    const assignedById = 'temp-inventory-officer-id';
    return this.repairsService.create(createRepairDto, assignedById);
  }

  /**
   * Get all repairs with optional filters
   * Query params: ?status=IN_REPAIR&assignedToId=abc-123
   */
  @Get()
  findAll(
    @Query('status') status?: RepairStatus,
    @Query('assignedToId') assignedToId?: string,
    @Query('terminalId') terminalId?: string,
  ) {
    return this.repairsService.findAll({ status, assignedToId, terminalId });
  }

  /**
   * Get technician dashboard stats
   * Example: GET /repairs/technician/abc-123/stats
   */
  @Get('technician/:technicianId/stats')
  getTechnicianStats(@Param('technicianId') technicianId: string) {
    return this.repairsService.getTechnicianStats(technicianId);
  }

  /**
   * Get repair by ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repairsService.findOne(id);
  }

  /**
   * Get repair by repair code
   * Example: GET /repairs/code/AWFQO
   */
  @Get('code/:repairCode')
  findByRepairCode(@Param('repairCode') repairCode: string) {
    return this.repairsService.findByRepairCode(repairCode);
  }

  /**
   * Update repair (Technician or QA)
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepairDto: UpdateRepairDto) {
    return this.repairsService.update(id, updateRepairDto);
  }

  /**
   * Delete repair
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repairsService.remove(id);
  }
}