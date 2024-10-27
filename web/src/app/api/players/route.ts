import { nanoid } from 'nanoid';
import prisma from '../../../../utils/db';
import { NextRequest } from 'next/server';
import { CreateUserPayload } from '@/models/user';

export async function POST(request: NextRequest) {
  const body: CreateUserPayload = await request.json();
  try {
    const player = await prisma.player.create({
      data: {
        id: nanoid(),
        profilePhoto: body.profilePhoto,
      },
    });
    return Response.json(player);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: 'Failed to create player' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const topPlayers = await prisma.player.findMany({
      orderBy: { score: 'desc' },
      include: {
        _count: { select: { initiatedBattles: true, invitedToBattles: true } },
      },
    });

    return Response.json(topPlayers);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: 'Failed to fetch winning players' },
      { status: 500 }
    );
  }
}
