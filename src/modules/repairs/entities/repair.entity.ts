import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
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

  // TERMINAL RELATIONSHIP
  @ManyToOne(() => Terminal, { eager: true })
  @JoinColumn({ name: 'terminalId' })
  terminal: Terminal;

  @Column()
  terminalId: string;

  // USER RELATIONSHIPS
  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignedById' })
  assignedBy: User;

  @Column()
  assignedById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @Column()
  assignedToId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'qaOfficerId' })
  qaOfficer: User;

  @Column({ nullable: true })
  qaOfficerId: string;

  // STATUS & FLAGS
  @Column({
    type: 'enum',
    enum: RepairStatus,
    default: RepairStatus.PENDING_ACCEPTANCE,
  })
  status: RepairStatus;

  @Column({ default: false })
  isHardToFix: boolean;

  // NOTES
  @Column({ type: 'text', nullable: true })
  initialIssue: string;

  @Column({ type: 'text', nullable: true })
  diagnosisNotes: string;

  @Column({ type: 'text', nullable: true })
  repairNotes: string;

  @Column({ type: 'text', nullable: true })
  qaRemarks: string;

  // TIMESTAMPS
  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  assignedAt: Date;

  @Column({ nullable: true })
  acceptedAt: Date;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  pushedToQaAt: Date;

  @Column({ nullable: true })
  qaCompletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}