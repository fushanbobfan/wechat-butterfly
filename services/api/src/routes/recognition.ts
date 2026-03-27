import { Router } from 'express';
import { getRecognitionJob } from './getRecognitionJob';
import type { RecognitionResult } from '../../../../packages/shared-types/src';

const recognitionRouter = Router();

const recognitionStore = new Map<string, RecognitionResult>([
  [
    'rec_001',
    {
      job_id: 'rec_001',
      candidates: [
        { id: 'tx_001', label: '红纹绿凤蝶', score: 0.984 },
        { id: 'tx_002', label: '安泰青凤蝶', score: 0.003 },
      ],
      explanation: {
        why_matched: ['翅面主色与纹理匹配', '尾突明显'],
        quality_flags: [],
        recommended_next_steps: ['补拍背面可进一步确认'],
      },
    },
  ],
]);

recognitionRouter.get('/api/v1/recognition/jobs/:id', async (req, res) => {
  const existing = recognitionStore.get(req.params.id);
  if (!existing) {
    return res.status(404).json({
      code: 'RECOGNITION_JOB_NOT_FOUND',
      message: `job ${req.params.id} not found`,
    });
  }

  try {
    const response = await getRecognitionJob(req.params.id, {
      async fetchByJobId(jobId: string): Promise<unknown> {
        return recognitionStore.get(jobId) ?? null;
      },
    });

    return res.status(response.status).json(response.body);
  } catch (error) {
    return res.status(422).json({
      code: 'INVALID_RECOGNITION_RESULT',
      message: error instanceof Error ? error.message : 'unknown error',
    });
  }
});

export default recognitionRouter;
