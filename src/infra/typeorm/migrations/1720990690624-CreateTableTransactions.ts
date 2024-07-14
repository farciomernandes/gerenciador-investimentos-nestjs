import { TransactionTypes } from '@modules/transaction/enums/transaction';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTableTransactions1720990690624
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('withdrawals');

    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'investment_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'transaction_date',
            type: 'timestamp with time zone',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal(10,2)',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: [TransactionTypes.INPUT, TransactionTypes.OUTPUT],
            default: "'INPUT'",
            isNullable: false,
          },
          {
            name: 'tax',
            type: 'decimal(10,2)',
            isNullable: true,
          },
          {
            name: 'net_amount',
            type: 'decimal(10,2)',
            isNullable: true,
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
      'transactions',
      new TableForeignKey({
        columnNames: ['investment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'investments',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transactions', 'FK_investmentId');

    await queryRunner.dropTable('transactions');

    await queryRunner.createTable(
      new Table({
        name: 'withdrawals',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'investment_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'withdrawal_date',
            type: 'timestamp with time zone',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal(10,2)',
            isNullable: false,
          },
          {
            name: 'tax',
            type: 'decimal(10,2)',
            isNullable: false,
          },
          {
            name: 'net_amount',
            type: 'decimal(10,2)',
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
      'withdrawals',
      new TableForeignKey({
        columnNames: ['investment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'investments',
        onDelete: 'CASCADE',
      }),
    );
  }
}
