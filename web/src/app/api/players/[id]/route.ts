import prisma from '../../../../../utils/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const player = await prisma.player.findUnique({
      where: {
        id,
      },
      include: {
        qrCode: true,
      },
    });
    if (!player) {
      return Response.json({ message: 'Player not found' }, { status: 404 });
    }
    return Response.json(player);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: 'Failed to fetch player' },
      { status: 500 }
    );
  }
}
