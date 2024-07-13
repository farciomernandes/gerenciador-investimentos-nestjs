import { BaseORMEntity } from '@infra/typeorm/shared/entities/base-orm.entity';
import { Investment } from '@modules/investment/entities/investment.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  @IsNotEmpty({ message: 'O campo nome é obrigatório' })
  @IsString()
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  @IsNotEmpty({ message: 'O campo email é obrigatório' })
  @IsEmail()
  @Index()
  email: string;

  @Column({ type: 'varchar', nullable: true })
  @IsNotEmpty({ message: 'O campo password é obrigatório' })
  @IsString()
  password: string;

  @OneToMany(() => Investment, (investment) => investment.owner)
  investments: Investment[];
}
