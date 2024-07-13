import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTableInvestment1720819308155 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'investment',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'ownerId',
            type: 'uuid',
          },
          {
            name: 'creationDate',
            type: 'timestamp',
          },
          {
            name: 'initialValue',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'currentValue',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '255',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'investment',
      new TableForeignKey({
        columnNames: ['ownerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('investment');
  }
}
