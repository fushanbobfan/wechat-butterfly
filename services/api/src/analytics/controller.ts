import type { Request, Response } from 'express';
import { AnalyticsEvent } from '../../../../packages/shared-types/src/analytics';
import { AnalyticsEventRepository } from './repository';

function validateEvent(event: Partial<AnalyticsEvent>): event is AnalyticsEvent {
  return Boolean(
    event.event_name &&
      event.payload &&
      event.payload.user_role &&
      event.payload.taxon_id &&
      event.payload.session_id &&
      event.payload.model_version &&
      event.payload.event_ts,
  );
}

export function createIngestAnalyticsHandler(repository: AnalyticsEventRepository) {
  return async function ingestAnalyticsEvent(req: Request, res: Response): Promise<void> {
    const event = req.body as Partial<AnalyticsEvent>;

    if (!validateEvent(event)) {
      res.status(400).json({ error: 'Invalid analytics event payload' });
      return;
    }

    await repository.insertEvent(event);
    res.status(202).json({ status: 'accepted' });
  };
}
