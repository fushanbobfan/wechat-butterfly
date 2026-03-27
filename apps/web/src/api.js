import {
  isAnalyticsEvent,
  isGameSessionConfig,
  isRecognitionResult,
} from './shared-contracts.mjs';
import { fixtureGameConfig, fixtureRecognition } from './demo-fixtures.mjs';

const API_BASE_URL = (window.__BUTTERFLY_CONFIG__ && window.__BUTTERFLY_CONFIG__.apiBaseUrl) || '';
const DEMO_MODE = (window.__BUTTERFLY_CONFIG__ && window.__BUTTERFLY_CONFIG__.demoMode) || 'fixture-fallback';
const REQUEST_TIMEOUT_MS = 4000;

async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function fallbackGameConfig(reason) {
  return {
    ...fixtureGameConfig,
    __demo: { source: 'fixture', reason },
  };
}

function fallbackRecognition(reason) {
  return {
    ...fixtureRecognition,
    __demo: { source: 'fixture', reason },
  };
}

export function getDemoMode() {
  return DEMO_MODE;
}

export async function getGameConfig() {
  if (!API_BASE_URL) {
    return fallbackGameConfig('API_BASE_URL is empty');
  }

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/games/configs`);
    if (!res.ok) throw new Error(`status=${res.status}`);
    const payload = await res.json();
    if (!isGameSessionConfig(payload)) throw new Error('contract invalid');
    return { ...payload, __demo: { source: 'api' } };
  } catch (error) {
    return fallbackGameConfig(error instanceof Error ? error.message : 'unknown error');
  }
}

export async function getRecognition(jobId = 'rec_001') {
  if (!API_BASE_URL) {
    return fallbackRecognition('API_BASE_URL is empty');
  }

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/recognition/jobs/${jobId}`);
    if (!res.ok) throw new Error(`status=${res.status}`);
    const payload = await res.json();
    if (!isRecognitionResult(payload)) throw new Error('contract invalid');
    return { ...payload, __demo: { source: 'api' } };
  } catch (error) {
    return fallbackRecognition(error instanceof Error ? error.message : 'unknown error');
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
    return { accepted: false, skipped: true, reason: 'API_BASE_URL is empty' };
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
  } catch (error) {
    return { accepted: false, skipped: true, reason: error instanceof Error ? error.message : 'unknown error' };
  }
}
