import { NextRequest, NextResponse } from 'next/server';
import { getBucket } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { path: string[] } }) {
  const key = params.path.join('/');
  const bucket = getBucket();
  const object = await bucket.get(key);

  if (!object) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const headers = new Headers();
  if (object.httpMetadata?.contentType) headers.set('Content-Type', object.httpMetadata.contentType);
  headers.set('etag', object.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  return new NextResponse(object.body as unknown as BodyInit, { headers });
}
