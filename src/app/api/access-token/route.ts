import { flexpaBaseURL } from '@/config';

const secret_key = process.env.FLEXPA_SECRET_KEY;

export async function POST(request: Request) {
  // if somehow we don't have a secret at all, don't go through any of these steps.
  if (!secret_key) {
    const errorBody = JSON.stringify({ code: 'ACCESS_TOKEN_REQUEST_FAILED' });
    return new Response(errorBody, { status: 503 });
  }
  const body = await request.json();
  const public_token: string = body.public_token;

  const flexpaRequest = await fetch(new URL('/link/exchange', flexpaBaseURL), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      public_token,
      secret_key,
    }),
  });

  if (flexpaRequest.status === 200) {
    const { access_token, expires_in } = await flexpaRequest.json();
    return new Response(JSON.stringify({ access_token, expires_in }));
  } else {
    console.log(await flexpaRequest.json());
    const errorBody = JSON.stringify({ code: 'ACCESS_TOKEN_REQUEST_FAILED' });
    return new Response(errorBody, { status: 400 });
  }
}
