import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function getBackendUrl() {
  if (process.env.ADMIN_API_URL) return process.env.ADMIN_API_URL;
  if (process.env.NODE_ENV !== 'production') return 'http://localhost:3001';
  return null;
}

async function proxy(request: NextRequest, context: { params: { path: string[] } }) {
  const backendUrl = getBackendUrl();
  if (!backendUrl) {
    return NextResponse.json(
      { error: 'ADMIN_API_URL is not configured.' },
      { status: 500 }
    );
  }

  const { path } = context.params;
  const targetUrl = new URL(`${backendUrl}/${path.join('/')}`);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('content-length');

  const method = request.method.toUpperCase();
  const hasBody = !['GET', 'HEAD'].includes(method);
  const body = hasBody ? Buffer.from(await request.arrayBuffer()) : undefined;

  let backendResponse: Response;
  try {
    backendResponse = await fetch(targetUrl, {
      method,
      headers,
      body,
    });
  } catch {
    return NextResponse.json(
      { error: 'Admin backend is unreachable.' },
      { status: 502 }
    );
  }

  const responseHeaders = new Headers(backendResponse.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('transfer-encoding');
  const setCookie = backendResponse.headers.get('set-cookie');
  if (setCookie) {
    responseHeaders.set('set-cookie', setCookie);
  }

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
