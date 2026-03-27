import type { AnalyticsEvent } from '../../../../packages/shared-types/src/analytics';

export interface AnalyticsEventRepository {
  insertEvent(event: AnalyticsEvent): Promise<void>;
}

interface PgClientLike {
  query: (sql: string, params: unknown[]) => Promise<unknown>;
}

export class PostgresAnalyticsEventRepository implements AnalyticsEventRepository {
  constructor(private readonly client: PgClientLike) {}

  async insertEvent(event: AnalyticsEvent): Promise<void> {
    const sql = `
      INSERT INTO analytics_event_store (
        event_name,
        payload,
        user_role,
        taxon_id,
        session_id,
        model_version,
        event_ts,
        ingest_ts
      ) VALUES ($1, $2::jsonb, $3, $4, $5, $6, $7::timestamptz, NOW())
    `;

    const { payload } = event;

    await this.client.query(sql, [
      event.event_name,
      JSON.stringify(payload),
      payload.user_role,
      payload.taxon_id,
      payload.session_id,
      payload.model_version,
      payload.event_ts,
    ]);
  }
}
