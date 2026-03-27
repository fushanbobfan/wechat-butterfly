import { fetchGameConfig, pickByMode } from '../gameConfigService';

export async function loadLinkUpQuestions(apiBaseUrl: string) {
  const all = await fetchGameConfig(apiBaseUrl);
  return pickByMode(all, 'link-up');
}
