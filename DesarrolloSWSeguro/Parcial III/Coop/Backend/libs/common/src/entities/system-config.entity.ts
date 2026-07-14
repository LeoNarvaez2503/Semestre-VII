import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'system_config' })
export class SystemConfigEntity {
  @PrimaryColumn({ default: 'default' })
  id: string;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 5000 })
  dailyTransferLimit: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 2.5 })
  commissionFee: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, default: 6.5 })
  savingsInterestRate: number;
}
