export function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function isRecognitionResult(payload) {
  if (!payload || typeof payload !== 'object') return false;
  const result = payload;
  return (
    typeof result.job_id === 'string' &&
    Array.isArray(result.candidates) &&
    result.candidates.every(
      (candidate) =>
        candidate &&
        typeof candidate.id === 'string' &&
        typeof candidate.label === 'string' &&
        typeof candidate.score === 'number',
    ) &&
    result.explanation &&
    isStringArray(result.explanation.why_matched) &&
    isStringArray(result.explanation.quality_flags) &&
    isStringArray(result.explanation.recommended_next_steps)
  );
}

export function isGameSessionConfig(payload) {
  if (!payload || typeof payload !== 'object') return false;

  if (
    typeof payload.config_id !== 'string' ||
    typeof payload.version !== 'string' ||
    typeof payload.locale !== 'string' ||
    typeof payload.published_at !== 'string' ||
    !Array.isArray(payload.questions)
  ) {
    return false;
  }

  return payload.questions.every((question) => {
    return (
      question &&
      typeof question.id === 'string' &&
      typeof question.mode === 'string' &&
      typeof question.stem === 'string' &&
      typeof question.taxon_id === 'string' &&
      typeof question.trait_tag === 'string' &&
      Array.isArray(question.options) &&
      question.explanation &&
      typeof question.explanation.error_template === 'string' &&
      typeof question.explanation.details === 'string'
    );
  });
}

export function isAnalyticsEvent(payload) {
  if (!payload || typeof payload !== 'object') return false;

  const event = payload;
  return Boolean(
    typeof event.event_name === 'string' &&
    event.payload &&
    typeof event.payload.user_role === 'string' &&
    typeof event.payload.taxon_id === 'string' &&
    typeof event.payload.session_id === 'string' &&
    typeof event.payload.model_version === 'string' &&
    typeof event.payload.event_ts === 'string',
  );
}
