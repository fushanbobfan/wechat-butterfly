import crypto from 'node:crypto';
import type { ExternalProvider } from './providers';

export interface ExternalLinkCacheRow {
  provider: ExternalProvider;
  url: string;
  lastCheckedAt: Date | null;
  statusCode: number | null;
  ttl: number;
  payloadHash: string;
  summaryCache: string | null;
}

export interface DbClient {
  query<T>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>;
}

export class ExternalLinkCacheRepository {
  constructor(private readonly db: DbClient) {}

  static buildPayloadHash(payload: string): string {
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  async upsert(row: ExternalLinkCacheRow): Promise<void> {
    await this.db.query(
      `INSERT INTO external_link_cache
        (provider, url, last_checked_at, status_code, ttl, payload_hash, summary_cache)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (provider, url)
       DO UPDATE SET
         last_checked_at = EXCLUDED.last_checked_at,
         status_code = EXCLUDED.status_code,
         ttl = EXCLUDED.ttl,
         payload_hash = EXCLUDED.payload_hash,
         summary_cache = EXCLUDED.summary_cache,
         updated_at = NOW()`,
      [
        row.provider,
        row.url,
        row.lastCheckedAt,
        row.statusCode,
        row.ttl,
        row.payloadHash,
        row.summaryCache,
      ],
    );
  }

  async findExpired(now = new Date()): Promise<ExternalLinkCacheRow[]> {
    const result = await this.db.query<ExternalLinkCacheRow>(
      `SELECT
         provider,
         url,
         last_checked_at AS "lastCheckedAt",
         status_code AS "statusCode",
         ttl,
         payload_hash AS "payloadHash",
         summary_cache AS "summaryCache"
       FROM external_link_cache
       WHERE
         last_checked_at IS NULL
         OR (last_checked_at + make_interval(secs => ttl)) <= $1`,
      [now],
    );
    return result.rows;
  }

  async findAll(): Promise<ExternalLinkCacheRow[]> {
    const result = await this.db.query<ExternalLinkCacheRow>(
      `SELECT
         provider,
         url,
         last_checked_at AS "lastCheckedAt",
         status_code AS "statusCode",
         ttl,
         payload_hash AS "payloadHash",
         summary_cache AS "summaryCache"
       FROM external_link_cache
       ORDER BY provider, url`,
    );

    return result.rows;
  }
}
