import { User } from '@modules/user/entities/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Investment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.investments)
  owner: User;

  @Column()
  creationDate: Date;

  @Column()
  initialValue: number;

  @Column()
  currentValue: number;

  @Column()
  status: string;
}
