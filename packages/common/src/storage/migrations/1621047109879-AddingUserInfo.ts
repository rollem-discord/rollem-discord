import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingUserInfo1621047109879 implements MigrationInterface {
    name = 'AddingUserInfo1621047109879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "flagsUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_070bee9576605e521fc4f78fd7a" UNIQUE ("flagsUserId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "siteDataUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_99a2595e1ac651b30b9b6354f96" UNIQUE ("siteDataUserId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_070bee9576605e521fc4f78fd7a" FOREIGN KEY ("flagsUserId") REFERENCES "user_flags"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_99a2595e1ac651b30b9b6354f96" FOREIGN KEY ("siteDataUserId") REFERENCES "user_site_data"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_99a2595e1ac651b30b9b6354f96"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_070bee9576605e521fc4f78fd7a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_99a2595e1ac651b30b9b6354f96"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "siteDataUserId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_070bee9576605e521fc4f78fd7a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "flagsUserId"`);
    }

}
