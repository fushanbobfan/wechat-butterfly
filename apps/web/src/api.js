const API_BASE_URL = (window.__BUTTERFLY_CONFIG__ && window.__BUTTERFLY_CONFIG__.apiBaseUrl) || '';

export async function getGameConfig() {
  const res = await fetch(`${API_BASE_URL}/api/v1/games/configs`);
  if (!res.ok) throw new Error('加载题库失败');
  return res.json();
}

export async function getRecognition(jobId = 'rec_001') {
  const res = await fetch(`${API_BASE_URL}/api/v1/recognition/jobs/${jobId}`);
  if (!res.ok) throw new Error('加载识别结果失败');
  return res.json();
}

export async function postAnalytics() {
  const payload = {
    event_name: 'topic_enter',
    payload: {
      user_role: 'public_demo',
      taxon_id: 'demo_taxon',
      session_id: `web-${Date.now()}`,
      model_version: 'demo-v1',
      event_ts: new Date().toISOString()
    }
  };
  const res = await fetch(`${API_BASE_URL}/api/analytics/events`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('埋点上报失败');
  return res.json();
}
