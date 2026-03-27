import type { RecognitionResult } from '../../../packages/shared-types/src';

export interface CompletenessSummary {
  total: number;
  complete: number;
  explanation_completeness_rate: number;
}

export function isExplanationComplete(result: RecognitionResult): boolean {
  const exp = result.explanation;

  return (
    Array.isArray(exp.why_matched) &&
    Array.isArray(exp.quality_flags) &&
    Array.isArray(exp.recommended_next_steps)
  );
}

/**
 * 用于后台统计看板：监控“解释完整率”。
 */
export function summarizeCompleteness(results: RecognitionResult[]): CompletenessSummary {
  const total = results.length;
  const complete = results.filter(isExplanationComplete).length;

  return {
    total,
    complete,
    explanation_completeness_rate: total === 0 ? 1 : complete / total,
  };
}
