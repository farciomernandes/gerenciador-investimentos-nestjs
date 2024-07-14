import { BaseORMEntity } from '@infra/typeorm/shared/entities/base-orm.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionTypes } from '../enums/transaction';

@Entity({ name: 'transactions' })
export class Transaction extends BaseORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  investment_id: string;

  @Column({ type: 'timestamp with time zone' })
  transaction_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionTypes,
    default: TransactionTypes.INPUT,
  })
  type: TransactionTypes;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  net_amount: number;
}
