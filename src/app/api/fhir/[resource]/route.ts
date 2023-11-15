import { flexpaBaseURL } from '@/config';
import { promisify } from 'util';

const sleep = promisify(setTimeout);
/**
 * This function retries a fetch request if the response is a 429 Too Many Requests.
 * Mostly shamelessly stolen from https://github.com/flexpa/quickstart/blob/master/server/src/routes/fhir.ts
 */
async function fetchWithRetry(
  url: URL | string,
  authorization: string,
  maxRetries = 10,
) {
  for (
    let retries = 0, delay = 1;
    retries < maxRetries;
    retries++, delay *= 2
  ) {
    try {
      console.log(`Fetching ${url}, retries: ${retries}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: authorization,
          'x-flexpa-raw': '0',
        },
      });
      if (response.status !== 429) {
        console.log(`Received ${response.status} from ${url}`);
        return response;
      }
      const retryAfter = response.headers.get('Retry-After') || delay;
      await sleep(Number(retryAfter) * 1000);
    } catch (err) {
      console.log(`Error fetching ${url}: ${err}`);
      throw err;
    }
  }
  throw new Error('Max retries reached.');
}

export async function GET(
  request: Request,
  { params }: { params: { resource: string } },
) {
  const auth = request.headers.get('authorization');
  const { search } = new URL(request.url);
  if (!auth) {
    return new Response(undefined, { status: 401 });
  }
  const resourceSearchResponse = await fetchWithRetry(
    new URL(`/fhir/${params.resource}${search}`, flexpaBaseURL),
    auth,
  );
  return resourceSearchResponse;
}
