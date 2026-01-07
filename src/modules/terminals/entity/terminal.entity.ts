import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'; 

@Entity('terminals')
export class Terminal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true})
    serialNumber: string;
    
    @Column()
    brand: string;

    @Column()
    model: string;

    @Column()
    deviceType: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    

}