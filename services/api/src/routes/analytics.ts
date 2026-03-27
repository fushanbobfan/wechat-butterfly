import { Router } from 'express';
import { createIngestAnalyticsHandler } from '../analytics/controller';
import type { AnalyticsEvent } from '../../../../packages/shared-types/src/analytics';

const analyticsRouter = Router();

class InMemoryAnalyticsRepository {
  private readonly events: AnalyticsEvent[] = [];

  async insertEvent(event: AnalyticsEvent): Promise<void> {
    this.events.push(event);
  }
}

const repository = new InMemoryAnalyticsRepository();

analyticsRouter.post('/api/analytics/events', createIngestAnalyticsHandler(repository));

export default analyticsRouter;
