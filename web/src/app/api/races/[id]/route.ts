import prisma from '@/utils/db';
import { WinnerEnum } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const races = await prisma.race.findMany({
      where: {
        winningPhoto: {
          not: null,
        },
        OR: [
          {
            playerOneID: id,
            winner: WinnerEnum.PLAYER1,
          },
          {
            playerTwoID: id,
            winner: WinnerEnum.PLAYER2,
          },
        ],
      },
      select: {
        winningPhoto: true,
      },
    });

    return Response.json({ data: races });
  } catch (error) {
    console.error('Error in GET /api/races/[id]:', error);
    return Response.json(
      { message: 'Error finding races for player' },
      { status: 500 }
    );
  }
}
