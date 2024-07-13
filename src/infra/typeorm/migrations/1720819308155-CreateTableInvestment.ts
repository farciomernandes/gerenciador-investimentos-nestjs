import { InvestmentStatus } from '@modules/investment/enums/investments';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTableInvestments1720819308155 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'investments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'owner_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'creation_date',
            type: 'timestamp with time zone',
            isNullable: false,
          },
          {
            name: 'initial_value',
            type: 'decimal(10,2)',
            isNullable: false,
          },
          {
            name: 'current_value',
            type: 'decimal(10,2)',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: [
              InvestmentStatus.ACTIVE,
              InvestmentStatus.CLOSED,
              InvestmentStatus.IN_PROGRESS,
              InvestmentStatus.SUSPENDED,
            ],
            default: "'IN_PROGRESS'",
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp with time zone',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'investments',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('investments');
  }
}
