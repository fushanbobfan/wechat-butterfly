import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';

const gamesRouter = Router();

const configPath = path.resolve(__dirname, '../data/game-configs.json');

type GameOption = {
  id: string;
  text: string;
  is_correct: boolean;
  taxon_id: string;
  trait_tag: string;
};

type GameQuestion = {
  id: string;
  mode: 'flash-card' | 'link-up' | 'identify' | 'eco-match';
  stem: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  age_band: '3-5' | '6-8' | '9-12' | '13+';
  taxon_id: string;
  trait_tag: string;
  options: GameOption[];
  explanation: {
    error_template: string;
    details: string;
  };
};

export type GameSessionConfig = {
  config_id: string;
  version: string;
  locale: string;
  published_at: string;
  questions: GameQuestion[];
};

export function isValidGameConfig(payload: unknown): payload is GameSessionConfig {
  if (typeof payload !== 'object' || payload === null) return false;
  const config = payload as Partial<GameSessionConfig>;
  if (!config.config_id || !config.version || !config.locale || !config.published_at) return false;
  if (!Array.isArray(config.questions)) return false;

  return config.questions.every((question) => {
    if (!question || typeof question !== 'object') return false;
    const typed = question as GameQuestion;
    return Boolean(
      typed.id &&
        typed.mode &&
        typed.stem &&
        typed.topic &&
        typed.difficulty &&
        typed.age_band &&
        typed.taxon_id &&
        typed.trait_tag &&
        Array.isArray(typed.options) &&
        typed.options.every((opt) => opt.id && opt.text && opt.taxon_id && opt.trait_tag) &&
        typed.explanation?.error_template &&
        typed.explanation?.details,
    );
  });
}

export function loadGameConfig(configFilePath = configPath): GameSessionConfig {
  const raw = fs.readFileSync(configFilePath, 'utf-8');
  const parsed = JSON.parse(raw);

  if (!isValidGameConfig(parsed)) {
    throw new Error('Invalid game config schema');
  }

  return parsed;
}

gamesRouter.get('/api/v1/games/configs', (_req, res) => {
  const config = loadGameConfig();
  res.json(config);
});

export default gamesRouter;
