import {
  isAnalyticsEvent,
  isGameSessionConfig,
  isRecognitionResult,
} from './shared-contracts.mjs';
import { fixtureGameConfig, fixtureRecognition } from './demo-fixtures.mjs';

const API_BASE_URL = (window.__BUTTERFLY_CONFIG__ && window.__BUTTERFLY_CONFIG__.apiBaseUrl) || '';
const DEMO_MODE = (window.__BUTTERFLY_CONFIG__ && window.__BUTTERFLY_CONFIG__.demoMode) || 'fixture-fallback';
const REQUEST_TIMEOUT_MS = 4000;

const fixtureTaxa = [
  {
    taxon_id: 'tx_001',
    display_name_zh: '红纹绿凤蝶',
    scientific_name: 'Papilio bianor',
    primary_color: 'green',
    temperature_preference: ['warm', 'hot'],
    habitat: ['forest_edge', 'garden'],
    kid_summary: '翅面有绿色金属光泽，飞行敏捷。',
  },
  {
    taxon_id: 'tx_002',
    display_name_zh: '安泰青凤蝶',
    scientific_name: 'Graphium antheus',
    primary_color: 'blue',
    temperature_preference: ['warm'],
    habitat: ['open_woodland'],
    kid_summary: '尾突明显，常在开阔地带活动。',
  },
  {
    taxon_id: 'tx_003',
    display_name_zh: '可罗青凤蝶',
    scientific_name: 'Graphium colonna',
    primary_color: 'black',
    temperature_preference: ['temperate', 'warm'],
    habitat: ['meadow', 'garden'],
    kid_summary: '黑色底色配浅色条纹，容易和近似种混淆。',
  },
];

async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function fallbackGameConfig() {
  return {
    ...fixtureGameConfig,
    __demo: { source: 'fixture' },
  };
}

function fallbackRecognition() {
  return {
    ...fixtureRecognition,
    __demo: { source: 'fixture' },
  };
}

export function getDemoMode() {
  return DEMO_MODE;
}

export async function getTaxa(keyword = '', temperature = '') {
  if (!API_BASE_URL) {
    return {
      source: 'fixture',
      rows: fixtureTaxa.filter((row) => {
        const k = keyword.trim().toLowerCase();
        const t = temperature.trim().toLowerCase();
        const keywordMatched = !k || [row.display_name_zh, row.scientific_name, row.kid_summary].join(' ').toLowerCase().includes(k);
        const tempMatched = !t || row.temperature_preference.includes(t);
        return keywordMatched && tempMatched;
      }),
    };
  }

  try {
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (temperature) params.set('temperature', temperature);

    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/taxa?${params.toString()}`);
    if (!res.ok) throw new Error('fetch taxa failed');
    const payload = await res.json();
    return { source: 'api', rows: payload.rows || [] };
  } catch {
    return { source: 'fixture', rows: fixtureTaxa };
  }
}

export async function getGameConfig() {
  if (!API_BASE_URL) {
    return fallbackGameConfig();
  }

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/games/configs`);
    if (!res.ok) throw new Error(`status=${res.status}`);
    const payload = await res.json();
    if (!isGameSessionConfig(payload)) throw new Error('contract invalid');
    return { ...payload, __demo: { source: 'api' } };
  } catch {
    return fallbackGameConfig();
  }
}

export async function getRecognition(jobId = 'rec_001') {
  if (!API_BASE_URL) {
    return fallbackRecognition();
  }

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/recognition/jobs/${jobId}`);
    if (!res.ok) throw new Error(`status=${res.status}`);
    const payload = await res.json();
    if (!isRecognitionResult(payload)) throw new Error('contract invalid');
    return { ...payload, __demo: { source: 'api' } };
  } catch {
    return fallbackRecognition();
  }
}

export async function postAnalytics() {
  const payload = {
    event_name: 'topic_enter',
    payload: {
      user_role: 'public_demo',
      taxon_id: 'demo_taxon',
      session_id: `web-${Date.now()}`,
      model_version: 'demo-v1',
      event_ts: new Date().toISOString(),
    },
  };

  if (!isAnalyticsEvent(payload)) {
    throw new Error('analytics payload 不符合共享契约');
  }

  if (!API_BASE_URL) {
    return { accepted: false, skipped: true, reason: 'fixture mode' };
  }

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/analytics/events`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return { accepted: false, skipped: true, reason: `status=${res.status}` };
    }
    return res.json();
  } catch {
    return { accepted: false, skipped: true, reason: 'network error' };
  }
}
