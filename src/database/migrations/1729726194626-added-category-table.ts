import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCategoryTable1729726194626 implements MigrationInterface {
  name = 'AddedCategoryTable1729726194626';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "payments" ADD "category_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_91fbd90e589339e9581a9cfad5b" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_91fbd90e589339e9581a9cfad5b"`,
    );
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "category_id"`);
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "created_at"`);
    await queryRunner.query(`DROP TABLE "categories"`);
  }
}
