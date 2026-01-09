import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RepairStatus } from '../../../common/enums';
import { Terminal } from '../../terminals/entity/terminal.entity';
import { User } from '../../users/entities/user.entity';

@Entity('repairs')
export class Repair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  repairCode: string;

  @ManyToOne(() => Terminal, { eager: true })
  @JoinColumn({ name: 'terminalId' })
  terminal: Terminal;

  @Column()
  terminalId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignedById' })
  assignedBy: User;

  @Column()
  assignedToId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'qaOfficerId' })
  qaOfficer: User;

  @Column({ nullable: true })
  qaOfficerId: string;

  @Column({
    type: 'enum',
    enum: RepairStatus,
    default: RepairStatus.PENDING_ACCEPTANCE,
  })
  status: RepairStatus;

  @Column({ default: false })
  isHardToFix: boolean;

  @Column({ type: 'text', nullable: true })
  initialIssue: string;

  @Column({ type: 'text', nullable: true })
  diagnosisNotes: string;

  @Column({ type: 'text', nullable: true })
  repairNotes: string;

  @Column({ type: 'text', nullable: true })
  qaRemarks: string;

  @CreateDateColumn()
  createdAt: Date;
}
