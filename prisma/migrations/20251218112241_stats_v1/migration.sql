/*
  Warnings:

  - Added the required column `baseAttack` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseDefense` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseHp` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseIntelligence` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseLuck` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseMind` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseSpeed` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseSpellEnergy` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "allocAttack" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "allocDefense" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "allocHp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "allocIntelligence" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "allocLuck" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "allocMind" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "allocSpeed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "allocSpellEnergy" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "baseAttack" INTEGER NOT NULL,
ADD COLUMN     "baseDefense" INTEGER NOT NULL,
ADD COLUMN     "baseHp" INTEGER NOT NULL,
ADD COLUMN     "baseIntelligence" INTEGER NOT NULL,
ADD COLUMN     "baseLuck" INTEGER NOT NULL,
ADD COLUMN     "baseMind" INTEGER NOT NULL,
ADD COLUMN     "baseSpeed" INTEGER NOT NULL,
ADD COLUMN     "baseSpellEnergy" INTEGER NOT NULL,
ADD COLUMN     "unspentPoints" INTEGER NOT NULL DEFAULT 0;
