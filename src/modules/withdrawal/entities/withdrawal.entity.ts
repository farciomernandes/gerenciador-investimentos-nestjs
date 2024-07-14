import { BaseORMEntity } from '@infra/typeorm/shared/entities/base-orm.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'withdrawals' })
export class Withdrawal extends BaseORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  investment_id: string;

  @Column({ type: 'timestamp with time zone' })
  withdrawal_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  net_amount: number;
}
