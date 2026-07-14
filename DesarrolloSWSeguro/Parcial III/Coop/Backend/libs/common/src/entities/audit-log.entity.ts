import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { UserRole } from './user.entity';

@Entity({ name: 'audit_logs' })
export class AuditLogEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  userName: string;

  @Column({ type: 'varchar', length: 20 })
  role: UserRole;

  @Column()
  action: string;

  @Column()
  details: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column()
  ipAddress: string;
}
