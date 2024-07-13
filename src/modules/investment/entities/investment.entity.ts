import { BaseORMEntity } from '@infra/typeorm/shared/entities/base-orm.entity';
import { User } from '@modules/user/entities/users.entity';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('investments')
export class Investment extends BaseORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.investments)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'timestamp with time zone' })
  creation_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  initial_value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  current_value: number;

  @Column({ type: 'varchar', length: '255' })
  status: string;
}
