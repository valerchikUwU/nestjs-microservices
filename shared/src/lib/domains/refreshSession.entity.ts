import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RefreshSession {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200, nullable: false })
  user_agent: string;

  @Column({ length: 200, nullable: false })
  fingerprint: string;

  @Column({ nullable: false })
  ip: string;

  @Column({ nullable: false })
  expiresIn: number;

  @Column({ nullable: false })
  refreshToken: string;

  @Column({type: 'uuid'})
  userId: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

}
