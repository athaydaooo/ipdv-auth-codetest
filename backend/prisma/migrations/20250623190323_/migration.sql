/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accessToken]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refreshToken]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessToken` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accessTokenExpiresAt` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshTokenExpiresAt` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Session_token_key";

-- DropIndex
DROP INDEX "Session_userId_token_idx";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "expiresAt",
DROP COLUMN "token",
ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "accessTokenExpiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL,
ADD COLUMN     "refreshTokenExpiresAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_accessToken_key" ON "Session"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "Session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_userId_accessToken_refreshToken_idx" ON "Session"("userId", "accessToken", "refreshToken");
