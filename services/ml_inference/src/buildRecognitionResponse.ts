import type {
  RecognitionCandidate,
  RecognitionExplanation,
  RecognitionResult,
} from '../../../packages/shared-types/src';

interface InferencePayload {
  job_id: string;
  candidates?: RecognitionCandidate[];
  explanation?: Partial<RecognitionExplanation>;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

/**
 * Always emits a complete explanation object with explicit arrays.
 */
export function buildRecognitionResponse(payload: InferencePayload): RecognitionResult {
  const normalizedExplanation: RecognitionExplanation = {
    why_matched: asStringArray(payload.explanation?.why_matched),
    quality_flags: asStringArray(payload.explanation?.quality_flags),
    recommended_next_steps: asStringArray(payload.explanation?.recommended_next_steps),
  };

  return {
    job_id: payload.job_id,
    candidates: payload.candidates ?? [],
    explanation: normalizedExplanation,
  };
}
