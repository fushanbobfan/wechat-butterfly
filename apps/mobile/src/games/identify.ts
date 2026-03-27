import { fetchGameConfig, pickByMode } from '../gameConfigService';

export async function loadIdentifyQuestions(apiBaseUrl: string) {
  const all = await fetchGameConfig(apiBaseUrl);
  return pickByMode(all, 'identify');
}
