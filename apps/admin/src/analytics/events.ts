import {
  ANALYTICS_EVENTS,
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsEventPayload,
} from '../../../../packages/shared-types/src/analytics';

const ADMIN_EVENT_DICT: Record<string, AnalyticsEventName> = {
  flashcardFlip: ANALYTICS_EVENTS.FLASHCARD_FLIP,
  feedbackSubmit: ANALYTICS_EVENTS.RECOGNITION_FEEDBACK_SUBMIT,
  sessionComplete: ANALYTICS_EVENTS.LEARNING_SESSION_COMPLETE,
  topicEnter: ANALYTICS_EVENTS.TOPIC_ENTER,
  topicExit: ANALYTICS_EVENTS.TOPIC_EXIT,
  recognitionResult: ANALYTICS_EVENTS.RECOGNITION_RESULT,
  correctionSubmit: ANALYTICS_EVENTS.CORRECTION_SUBMIT,
};

export interface AdminAnalyticsContext {
  userRole: string;
  taxonId: string;
  sessionId: string;
  modelVersion: string;
}

export function buildAdminAnalyticsEvent(
  key: keyof typeof ADMIN_EVENT_DICT,
  context: AdminAnalyticsContext,
  extra: Omit<AnalyticsEventPayload, 'user_role' | 'taxon_id' | 'session_id' | 'model_version' | 'event_ts'> = {},
): AnalyticsEvent {
  return {
    event_name: ADMIN_EVENT_DICT[key],
    payload: {
      user_role: context.userRole,
      taxon_id: context.taxonId,
      session_id: context.sessionId,
      model_version: context.modelVersion,
      event_ts: new Date().toISOString(),
      ...extra,
    },
  };
}

export async function reportAdminEvent(event: AnalyticsEvent): Promise<void> {
  await fetch('/api/analytics/events', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(event),
  });
}
