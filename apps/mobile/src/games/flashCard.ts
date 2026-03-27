import { fetchGameConfig, pickByMode } from '../gameConfigService';

export async function loadFlashCardQuestions(apiBaseUrl: string) {
  const all = await fetchGameConfig(apiBaseUrl);
  return pickByMode(all, 'flash-card');
}
