import express from 'express';
import gamesRouter from './routes/games';
import learningRouter from './routes/learning';
import analyticsRouter from './routes/analytics';
import recognitionRouter from './routes/recognition';

const app = express();
app.use(express.json());

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, service: 'api' });
});

app.use(gamesRouter);
app.use(learningRouter);
app.use(analyticsRouter);
app.use(recognitionRouter);

export default app;
