import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Optional: only allow images from these hosts (safety)
const ALLOWED_HOSTS = [
  'precisa.com',
  'www.precisa.com',
  'novabiomedical.com',
  'www.novabiomedical.com',
  'memmert.com',
  'www.memmert.com',
  'eppendorf.com',
  'www.eppendorf.com',
];

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }

  // Only http/https
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return NextResponse.json({ error: 'Invalid protocol' }, { status: 400 });
  }

  // Optional host allowlist — remove this block if you want to allow anything
  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return NextResponse.json({ error: 'Host not allowed' }, { status: 403 });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        // Some servers reject requests without a UA
        'User-Agent': 'Mozilla/5.0 (compatible; EsiLabBot/1.0)',
        Accept: 'image/*,*/*;q=0.8',
      },
      // Cache for 24h on the edge/CDN
      next: { revalidate: 86400 },
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: `Upstream ${upstream.status}` },
        { status: 502 }
      );
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (err) {
    console.error('[image-proxy] fetch failed:', err);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 502 });
  }
}