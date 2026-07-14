import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'BLOCKED';
export type AccountType = 'AHORROS' | 'CORRIENTE';

@Entity({ name: 'accounts' })
export class AccountEntity {
  @PrimaryColumn()
  id: string;

  @Index()
  @Column()
  userId: string;

  @Column({ unique: true })
  accountNumber: string;

  @Column({ type: 'varchar', length: 20 })
  type: AccountType;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status: AccountStatus;

  @CreateDateColumn()
  createdAt: Date;
}
