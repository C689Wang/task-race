import { handleUpload, HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, response: NextResponse) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('blob upload completed', blob, tokenPayload);
      },
    });
    return Response.json(jsonResponse);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Error uploading photo' }, { status: 500 });
  }
}
