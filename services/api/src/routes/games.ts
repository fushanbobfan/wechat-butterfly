import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';

const gamesRouter = Router();

const configPath = path.resolve(__dirname, '../data/game-configs.json');

gamesRouter.get('/api/v1/games/configs', (_req, res) => {
  const raw = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(raw);
  res.json(config);
});

export default gamesRouter;
