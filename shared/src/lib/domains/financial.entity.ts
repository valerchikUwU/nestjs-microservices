import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Financial {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false, unique: true })
  financialNumber: string;

  @Column({
        type: "decimal", 
        scale: 2, 
        nullable: false, 
        default: 0,
        transformer: {
          to: (value: number) => value,
          from: (value: string) => parseFloat(value),
        },
    })
  balance: number;

  @Column({type: 'uuid'})
  userId: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

}
