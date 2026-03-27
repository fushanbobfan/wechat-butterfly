interface TokenBucketState {
  tokens: number;
  lastRefillMs: number;
}

export class InMemoryRateLimiter {
  private buckets = new Map<string, TokenBucketState>();

  async throttle(key: string, requestsPerSecond: number, burst: number): Promise<void> {
    const now = Date.now();
    const bucket = this.buckets.get(key) ?? {
      tokens: burst,
      lastRefillMs: now,
    };

    const elapsedSeconds = Math.max(0, (now - bucket.lastRefillMs) / 1000);
    bucket.tokens = Math.min(burst, bucket.tokens + elapsedSeconds * requestsPerSecond);
    bucket.lastRefillMs = now;

    if (bucket.tokens < 1) {
      const waitMs = Math.ceil((1 - bucket.tokens) * (1000 / requestsPerSecond));
      this.buckets.set(key, bucket);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      return this.throttle(key, requestsPerSecond, burst);
    }

    bucket.tokens -= 1;
    this.buckets.set(key, bucket);
  }
}
