export type GameMode = 'flash-card' | 'link-up' | 'identify' | 'eco-match';

export interface RuntimeQuestion {
  id: string;
  mode: GameMode;
  stem: string;
  taxon_id: string;
  trait_tag: string;
  options: Array<{ id: string; text: string; is_correct: boolean }>;
  explanation: { error_template: string; details: string };
}

export async function fetchGameConfig(baseUrl: string): Promise<RuntimeQuestion[]> {
  const response = await fetch(`${baseUrl}/api/v1/games/configs`);
  if (!response.ok) {
    throw new Error(`failed to load config: ${response.status}`);
  }

  const config = await response.json();
  return (config.questions ?? []) as RuntimeQuestion[];
}

export function pickByMode(questions: RuntimeQuestion[], mode: GameMode): RuntimeQuestion[] {
  return questions.filter((question) => question.mode === mode);
}
