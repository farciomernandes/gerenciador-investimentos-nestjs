import { BaseORMEntity } from '@infra/typeorm/shared/entities/base-orm.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionTypes } from '../enums/transaction';
import { Investment } from '@modules/investment/entities/investment.entity';

@Entity({ name: 'transactions' })
export class Transaction extends BaseORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  investment_id: string;

  @ManyToOne(() => Investment, (investment) => investment.id)
  @JoinColumn({ name: 'investment_id' })
  investment: Investment;

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
