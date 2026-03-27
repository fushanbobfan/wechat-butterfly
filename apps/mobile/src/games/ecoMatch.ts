import { fetchGameConfig, pickByMode } from '../gameConfigService';

export async function loadEcoMatchQuestions(apiBaseUrl: string) {
  const all = await fetchGameConfig(apiBaseUrl);
  return pickByMode(all, 'eco-match');
}
