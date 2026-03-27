export interface DashboardMetric {
  key: 'learning_completion_rate' | 'top1_hit_rate' | 'top3_hit_rate' | 'correction_rate' | 'topic_usage_count';
  label: string;
  value: number;
  unit: 'ratio' | 'count';
}

export interface MetricInput {
  sessionsStarted: number;
  sessionsCompleted: number;
  recognitionTotal: number;
  top1Hits: number;
  top3Hits: number;
  correctionsSubmitted: number;
  recognitionWrong: number;
  topicEnterCount: number;
}

export function computeDashboardMetrics(input: MetricInput): DashboardMetric[] {
  const safeDivide = (n: number, d: number): number => (d === 0 ? 0 : n / d);

  return [
    {
      key: 'learning_completion_rate',
      label: '学习完成率',
      value: safeDivide(input.sessionsCompleted, input.sessionsStarted),
      unit: 'ratio',
    },
    {
      key: 'top1_hit_rate',
      label: 'Top-1 命中率',
      value: safeDivide(input.top1Hits, input.recognitionTotal),
      unit: 'ratio',
    },
    {
      key: 'top3_hit_rate',
      label: 'Top-3 命中率',
      value: safeDivide(input.top3Hits, input.recognitionTotal),
      unit: 'ratio',
    },
    {
      key: 'correction_rate',
      label: '纠错率',
      value: safeDivide(input.correctionsSubmitted, input.recognitionWrong),
      unit: 'ratio',
    },
    {
      key: 'topic_usage_count',
      label: '专题使用次数',
      value: input.topicEnterCount,
      unit: 'count',
    },
  ];
}

export const METRIC_SQL = {
  sessionsStarted: `SELECT COUNT(DISTINCT session_id) FROM analytics_event_store WHERE event_name = 'topic_enter';`,
  sessionsCompleted: `SELECT COUNT(DISTINCT session_id) FROM analytics_event_store WHERE event_name = 'learning_session_complete';`,
  recognitionTotal: `SELECT COUNT(*) FROM analytics_event_store WHERE event_name = 'recognition_result';`,
  top1Hits: `SELECT COUNT(*) FROM analytics_event_store WHERE event_name = 'recognition_result' AND (payload->>'is_top1_hit')::boolean = true;`,
  top3Hits: `SELECT COUNT(*) FROM analytics_event_store WHERE event_name = 'recognition_result' AND (payload->>'is_top3_hit')::boolean = true;`,
  correctionsSubmitted: `SELECT COUNT(*) FROM analytics_event_store WHERE event_name = 'correction_submit';`,
  recognitionWrong: `SELECT COUNT(*) FROM analytics_event_store WHERE event_name = 'recognition_result' AND (payload->>'is_correct')::boolean = false;`,
  topicEnterCount: `SELECT COUNT(*) FROM analytics_event_store WHERE event_name = 'topic_enter';`,
};
