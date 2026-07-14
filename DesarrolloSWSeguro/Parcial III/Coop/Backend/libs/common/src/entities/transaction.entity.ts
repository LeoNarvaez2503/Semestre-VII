import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
export type TransactionStatus = 'SUCCESS' | 'FAILED';

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @PrimaryColumn()
  id: string;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  sourceAccountId: string | null;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  destinationAccountId: string | null;

  @Column({ type: 'varchar', length: 20 })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column()
  ipAddress: string;

  @Column({ type: 'varchar', length: 20, default: 'SUCCESS' })
  status: TransactionStatus;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  fee: number;

  @Column()
  refCode: string;
}
