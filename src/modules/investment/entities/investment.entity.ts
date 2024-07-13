import { User } from '@modules/user/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'investments' })
export class Investment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.investments)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column()
  creation_date: Date;

  @Column()
  initial_value: number;

  @Column()
  current_value: number;

  @Column()
  status: string;
}
