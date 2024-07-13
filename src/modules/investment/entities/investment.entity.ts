import { BaseORMEntity } from '@infra/typeorm/shared/entities/base-orm.entity';
import { User } from '@modules/user/entities/users.entity';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvestmentStatus } from '../enums/investments';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity('investments')
export class Investment extends BaseORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.investments)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'varchar', nullable: true })
  @IsNotEmpty({ message: 'O campo nome é obrigatório' })
  @IsString()
  name: string;

  @Column({ type: 'timestamp with time zone' })
  creation_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  initial_value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  current_value: number;

  @Column({
    type: 'enum',
    enum: InvestmentStatus,
    default: InvestmentStatus.ACTIVE,
  })
  status: InvestmentStatus;

  static toDto(investment: Investment): any {
    const investmentDto: any = {
      creation_date: investment.creation_date,
      initial_value: Number(investment.initial_value),
      current_value: Number(investment.current_value),
      status: investment.status,
      owner: {
        email: investment.owner.email,
        name: investment.owner.name,
        id: investment.owner.id,
      },
    };

    return investmentDto;
  }
}
