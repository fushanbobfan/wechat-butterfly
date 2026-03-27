import { ExternalLinkCacheRepository } from '../link/externalLinkCacheRepository';
import { LinkAggregatorService } from '../link/linkAggregatorService';

export class ExternalLinkHealthCheckJob {
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private readonly cacheRepository: ExternalLinkCacheRepository,
    private readonly aggregatorService: LinkAggregatorService,
    private readonly intervalMs = 5 * 60 * 1000,
  ) {}

  start(): void {
    if (this.timer) return;

    this.timer = setInterval(() => {
      void this.runOnce();
    }, this.intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async runOnce(): Promise<void> {
    const expiredRows = await this.cacheRepository.findExpired();

    for (const row of expiredRows) {
      const result = await this.aggregatorService.refreshLink({
        provider: row.provider,
        url: row.url,
        fallbackSummary: row.summaryCache ?? 'No cached summary available.',
      });

      if (!result.available) {
        await this.cacheRepository.upsert({
          ...row,
          lastCheckedAt: new Date(),
          statusCode: result.statusCode,
          payloadHash: ExternalLinkCacheRepository.buildPayloadHash(result.summary),
          summaryCache: result.summary,
        });
      }
    }
  }
}
