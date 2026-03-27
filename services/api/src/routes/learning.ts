import { Router } from 'express';

const learningRouter = Router();

learningRouter.post('/api/v1/learning/events', (req, res) => {
  const body = req.body as {
    user_id: string;
    question_id: string;
    taxon_id: string;
    trait_tag: string;
    outcome: 'correct' | 'wrong';
    answer_latency_ms?: number;
  };

  if (!body?.question_id || !body?.taxon_id || !body?.trait_tag) {
    return res.status(400).json({
      code: 'INVALID_EVENT',
      message: 'question_id、taxon_id、trait_tag 为必填字段'
    });
  }

  // 这里可接入 Kafka / ClickHouse 等学习行为流水。
  return res.status(202).json({
    accepted: true,
    event: body,
    received_at: new Date().toISOString()
  });
});

export default learningRouter;
