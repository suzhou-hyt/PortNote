/*
  Warnings:

  - Added the required column `serverId` to the `Port` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Port" ADD COLUMN     "serverId" INTEGER NOT NULL;
