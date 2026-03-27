export type ExternalProvider = 'wikipedia' | 'gbif' | 'wikidata' | 'col';

export interface RetryPolicy {
  retries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  retryOnStatus: number[];
}

export interface RateLimitPolicy {
  requestsPerSecond: number;
  burst: number;
}

export interface ProviderPolicy {
  provider: ExternalProvider;
  timeoutMs: number;
  retry: RetryPolicy;
  rateLimit: RateLimitPolicy;
}

export const PROVIDER_POLICIES: Record<ExternalProvider, ProviderPolicy> = {
  wikipedia: {
    provider: 'wikipedia',
    timeoutMs: 4000,
    retry: {
      retries: 2,
      baseDelayMs: 200,
      maxDelayMs: 2000,
      retryOnStatus: [429, 500, 502, 503, 504],
    },
    rateLimit: {
      requestsPerSecond: 2,
      burst: 4,
    },
  },
  gbif: {
    provider: 'gbif',
    timeoutMs: 5000,
    retry: {
      retries: 3,
      baseDelayMs: 300,
      maxDelayMs: 3000,
      retryOnStatus: [429, 500, 502, 503, 504],
    },
    rateLimit: {
      requestsPerSecond: 3,
      burst: 5,
    },
  },
  wikidata: {
    provider: 'wikidata',
    timeoutMs: 4500,
    retry: {
      retries: 2,
      baseDelayMs: 250,
      maxDelayMs: 2500,
      retryOnStatus: [429, 500, 502, 503, 504],
    },
    rateLimit: {
      requestsPerSecond: 2,
      burst: 4,
    },
  },
  col: {
    provider: 'col',
    timeoutMs: 6000,
    retry: {
      retries: 3,
      baseDelayMs: 400,
      maxDelayMs: 4000,
      retryOnStatus: [429, 500, 502, 503, 504],
    },
    rateLimit: {
      requestsPerSecond: 1,
      burst: 2,
    },
  },
};
