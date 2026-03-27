import { logAuditEvent } from '../audit/logAuditEvent';
import type { RecognitionResult } from '../../../../packages/shared-types/src';

interface RecognitionStore {
  fetchByJobId(jobId: string): Promise<unknown>;
}

interface HttpResponse {
  status: number;
  body: unknown;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function validateRecognitionResult(result: unknown, jobId: string): asserts result is RecognitionResult {
  const route = '/api/v1/recognition/jobs/:id';

  if (typeof result !== 'object' || result === null) {
    logAuditEvent({
      event: 'recognition_explanation_validation_failed',
      jobId,
      route,
      reason: 'result is not object',
    });
    throw new Error('Invalid recognition response: result is not object');
  }

  const explanation = (result as { explanation?: unknown }).explanation;

  if (typeof explanation !== 'object' || explanation === null) {
    logAuditEvent({
      event: 'recognition_explanation_validation_failed',
      jobId,
      route,
      reason: 'missing explanation object',
    });
    throw new Error('Invalid recognition response: explanation is required');
  }

  const typedExplanation = explanation as Record<string, unknown>;
  const requiredFields = ['why_matched', 'quality_flags', 'recommended_next_steps'] as const;

  for (const field of requiredFields) {
    if (!(field in typedExplanation)) {
      logAuditEvent({
        event: 'recognition_explanation_validation_failed',
        jobId,
        route,
        reason: `missing field: ${field}`,
      });
      throw new Error(`Invalid recognition response: missing explanation.${field}`);
    }

    if (!isStringArray(typedExplanation[field])) {
      logAuditEvent({
        event: 'recognition_explanation_validation_failed',
        jobId,
        route,
        reason: `field ${field} is not string[]`,
      });
      throw new Error(`Invalid recognition response: explanation.${field} must be string[]`);
    }
  }
}

export async function getRecognitionJob(jobId: string, store: RecognitionStore): Promise<HttpResponse> {
  const result = await store.fetchByJobId(jobId);
  validateRecognitionResult(result, jobId);

  return {
    status: 200,
    body: result,
  };
}
