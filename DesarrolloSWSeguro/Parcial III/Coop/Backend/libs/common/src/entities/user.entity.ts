import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

export type UserRole = 'CLIENTE' | 'CAJERO' | 'AUDITOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  identityId: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  role: UserRole;

  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status: UserStatus;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
