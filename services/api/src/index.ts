import express from 'express';
import gamesRouter from './routes/games';
import learningRouter from './routes/learning';

const app = express();
app.use(express.json());

app.use(gamesRouter);
app.use(learningRouter);

export default app;
