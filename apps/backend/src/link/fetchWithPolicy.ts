import { PROVIDER_POLICIES, type ExternalProvider } from './providers';
import { InMemoryRateLimiter } from './rateLimiter';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface FetchOutcome {
  statusCode: number;
  body: string;
}

export class ProviderHttpClient {
  constructor(private readonly limiter: InMemoryRateLimiter) {}

  async fetch(provider: ExternalProvider, url: string): Promise<FetchOutcome> {
    const policy = PROVIDER_POLICIES[provider];
    await this.limiter.throttle(provider, policy.rateLimit.requestsPerSecond, policy.rateLimit.burst);

    for (let attempt = 0; attempt <= policy.retry.retries; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), policy.timeoutMs);

      try {
        const res = await fetch(url, { signal: controller.signal });
        const body = await res.text();

        if (!policy.retry.retryOnStatus.includes(res.status) || attempt === policy.retry.retries) {
          return {
            statusCode: res.status,
            body,
          };
        }
      } catch (error) {
        if (attempt === policy.retry.retries) {
          throw error;
        }
      } finally {
        clearTimeout(timeout);
      }

      const backoff = Math.min(
        policy.retry.maxDelayMs,
        policy.retry.baseDelayMs * 2 ** attempt,
      );
      await sleep(backoff);
    }

    return {
      statusCode: 599,
      body: '',
    };
  }
}
