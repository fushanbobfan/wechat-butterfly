export interface RecognitionExplanation {
  /**
   * Why a candidate was matched (model evidence or feature-level rationale).
   */
  why_matched: string[];

  /**
   * Quality caveats to help downstream products gate risky predictions.
   */
  quality_flags: string[];

  /**
   * Actionable guidance for clients / operations.
   */
  recommended_next_steps: string[];
}

export interface RecognitionCandidate {
  id: string;
  score: number;
  label: string;
}

export interface RecognitionResult {
  job_id: string;
  candidates: RecognitionCandidate[];
  explanation: RecognitionExplanation;
}
