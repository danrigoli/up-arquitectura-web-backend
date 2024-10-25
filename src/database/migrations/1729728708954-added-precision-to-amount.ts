import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPrecisionToAmount1729728708954 implements MigrationInterface {
    name = 'AddedPrecisionToAmount1729728708954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "amount" numeric(10,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "amount" integer NOT NULL`);
    }

}
