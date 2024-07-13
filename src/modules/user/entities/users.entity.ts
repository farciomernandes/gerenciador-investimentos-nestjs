import { Investment } from '@modules/investment/entities/investment.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @OneToMany(() => Investment, (investment) => investment.owner)
  investments: Investment[];
}
