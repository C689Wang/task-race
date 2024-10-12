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
        OR: [
          {
            AND: [
              { playerOneID: id as string },
              { winner: WinnerEnum.PLAYER1 },
            ],
          },
          {
            AND: [
              { playerTwoID: id as string },
              { winner: WinnerEnum.PLAYER2 },
            ],
          },
        ],
      },
    });

    return Response.json({ data: races });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: 'Error finding races for player' },
      { status: 500 }
    );
  }
}
