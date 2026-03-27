import {
  ExternalLinkCacheRepository,
  type ExternalLinkCacheRow,
} from './externalLinkCacheRepository';
import { ProviderHttpClient } from './fetchWithPolicy';
import type { ExternalProvider } from './providers';

export interface ExternalLinkResult {
  provider: ExternalProvider;
  url: string;
  available: boolean;
  statusCode: number | null;
  summary: string;
}

export interface ProviderDescriptor {
  provider: ExternalProvider;
  url: string;
  fallbackSummary: string;
}

export class LinkAggregatorService {
  constructor(
    private readonly cacheRepository: ExternalLinkCacheRepository,
    private readonly providerHttpClient: ProviderHttpClient,
  ) {}

  /**
   * Unified backend contract: frontend consumes URLs from this method only,
   * and should not concatenate provider URLs client-side.
   */
  async getExternalLinks(descriptors: ProviderDescriptor[]): Promise<ExternalLinkResult[]> {
    const results: ExternalLinkResult[] = [];

    for (const descriptor of descriptors) {
      const fetched = await this.refreshLink(descriptor);
      results.push(fetched);
    }

    return results;
  }

  async refreshLink(descriptor: ProviderDescriptor): Promise<ExternalLinkResult> {
    try {
      const response = await this.providerHttpClient.fetch(descriptor.provider, descriptor.url);
      const payloadHash = ExternalLinkCacheRepository.buildPayloadHash(response.body);
      const available = response.statusCode >= 200 && response.statusCode < 400;

      await this.cacheRepository.upsert({
        provider: descriptor.provider,
        url: descriptor.url,
        lastCheckedAt: new Date(),
        statusCode: response.statusCode,
        ttl: 3600,
        payloadHash,
        summaryCache: available ? descriptor.fallbackSummary : descriptor.fallbackSummary,
      });

      return {
        provider: descriptor.provider,
        url: descriptor.url,
        available,
        statusCode: response.statusCode,
        summary: descriptor.fallbackSummary,
      };
    } catch {
      await this.cacheRepository.upsert({
        provider: descriptor.provider,
        url: descriptor.url,
        lastCheckedAt: new Date(),
        statusCode: 599,
        ttl: 3600,
        payloadHash: ExternalLinkCacheRepository.buildPayloadHash(descriptor.fallbackSummary),
        summaryCache: descriptor.fallbackSummary,
      });

      return {
        provider: descriptor.provider,
        url: descriptor.url,
        available: false,
        statusCode: 599,
        summary: descriptor.fallbackSummary,
      };
    }
  }

  hydrateFromCache(row: ExternalLinkCacheRow): ExternalLinkResult {
    const isAvailable = row.statusCode !== null && row.statusCode >= 200 && row.statusCode < 400;
    return {
      provider: row.provider,
      url: row.url,
      available: isAvailable,
      statusCode: row.statusCode,
      summary: row.summaryCache ?? 'No cached summary available.',
    };
  }
}
