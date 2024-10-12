-- CreateEnum
CREATE TYPE "WinnerEnum" AS ENUM ('PLAYER1', 'PLAYER2');

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "score" INTEGER,
    "profilePhoto" TEXT,
    "qrCodeId" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Race" (
    "id" TEXT NOT NULL,
    "playerOneID" TEXT NOT NULL,
    "playerTwoID" TEXT NOT NULL,
    "winner" "WinnerEnum",
    "winningPhoto" TEXT,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QRCode" (
    "id" TEXT NOT NULL,
    "encoding" TEXT NOT NULL,

    CONSTRAINT "QRCode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_qrCodeId_fkey" FOREIGN KEY ("qrCodeId") REFERENCES "QRCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_playerOneID_fkey" FOREIGN KEY ("playerOneID") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_playerTwoID_fkey" FOREIGN KEY ("playerTwoID") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
