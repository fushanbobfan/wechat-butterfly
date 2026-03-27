const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const contractsPath = path.join(__dirname, '..', 'packages', 'shared-types', 'src', 'runtime-contracts.mjs');

test('recognition runtime contract validator works', async () => {
  const { isRecognitionResult } = await import(`file://${contractsPath}`);

  const valid = {
    job_id: 'rec_001',
    candidates: [{ id: 'tx_1', label: '蝴蝶', score: 0.9 }],
    explanation: {
      why_matched: ['特征吻合'],
      quality_flags: [],
      recommended_next_steps: ['补拍反面'],
    },
  };

  assert.equal(isRecognitionResult(valid), true);
  assert.equal(isRecognitionResult({ job_id: 'x' }), false);
});

test('analytics runtime contract validator works', async () => {
  const { isAnalyticsEvent } = await import(`file://${contractsPath}`);

  assert.equal(
    isAnalyticsEvent({
      event_name: 'topic_enter',
      payload: {
        user_role: 'teacher',
        taxon_id: 'tx',
        session_id: 's',
        model_version: 'v1',
        event_ts: '2026-03-27T00:00:00Z',
      },
    }),
    true,
  );

  assert.equal(isAnalyticsEvent({ event_name: 'topic_enter' }), false);
});
