export const fixtureGameConfig = {
  config_id: 'fixture-demo-cn',
  version: '2026.03.27',
  locale: 'zh-CN',
  published_at: '2026-03-27T00:00:00.000Z',
  questions: [
    {
      id: 'fixture-q-001',
      mode: 'flash-card',
      stem: '哪种触角形态更符合蝴蝶？',
      topic: '形态识别',
      difficulty: 'easy',
      age_band: '6-8',
      taxon_id: 'lepidoptera:papilio_xuthus',
      trait_tag: 'antenna_club_shape',
      options: [
        { id: 'a', text: '棒状触角', is_correct: true, taxon_id: 'lepidoptera:papilio_xuthus', trait_tag: 'antenna_club_shape' },
        { id: 'b', text: '羽状触角', is_correct: false, taxon_id: 'lepidoptera:moth_generic', trait_tag: 'antenna_feather_shape' }
      ],
      explanation: {
        error_template: '触角形态差异',
        details: '蝴蝶多为棒状触角，蛾类更常见羽状触角。'
      }
    }
  ]
};

export const fixtureRecognition = {
  job_id: 'rec_fixture',
  candidates: [
    { id: 'tx_001', label: '红纹绿凤蝶', score: 0.91 },
    { id: 'tx_002', label: '安泰青凤蝶', score: 0.07 },
    { id: 'tx_003', label: '可罗青凤蝶', score: 0.02 }
  ],
  explanation: {
    why_matched: ['主色与纹理高度一致', '尾突与翅形符合特征模板'],
    quality_flags: ['使用了演示后备数据'],
    recommended_next_steps: ['如条件允许，请补拍背面照片']
  }
};
