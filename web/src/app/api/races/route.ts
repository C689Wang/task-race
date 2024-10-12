import prisma from '@/utils/db';

export async function GET(request: Request) {
  try {
    const photos = await prisma.race.findMany({
      where: { winningPhoto: { not: null } },
      select: { winningPhoto: true },
    });

    return Response.json({ data: photos });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Error finding photos' }, { status: 500 });
  }
}
