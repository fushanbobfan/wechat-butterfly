export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type AgeBand = '3-5' | '6-8' | '9-12' | '13+';

export interface GameOption {
  id: string;
  text: string;
  image_url?: string;
  is_correct: boolean;
  taxon_id: string;
  trait_tag: string;
}

export interface GameExplanation {
  /**
   * 用于复用的错误解释模板，例如："尾突长度差异"。
   */
  error_template: string;
  details: string;
  reference_url?: string;
}

export interface GameQuestion {
  id: string;
  mode: 'flash-card' | 'link-up' | 'identify' | 'eco-match';
  stem: string;
  topic: string;
  difficulty: DifficultyLevel;
  age_band: AgeBand;
  taxon_id: string;
  trait_tag: string;
  options: GameOption[];
  explanation: GameExplanation;
}

export interface GameSessionConfig {
  config_id: string;
  version: string;
  locale: string;
  published_at: string;
  questions: GameQuestion[];
}
