export interface ExternalLinkHealthItem {
  provider: string;
  url: string;
  available: boolean;
  statusCode: number | null;
  summary: string;
}

export async function fetchExternalLinkHealth(): Promise<ExternalLinkHealthItem[]> {
  const response = await fetch('/api/admin/external-links/health');
  if (!response.ok) throw new Error('Failed to load external link health status');

  const data = (await response.json()) as { items: ExternalLinkHealthItem[] };
  return data.items;
}

export async function triggerExternalLinkHealthRefresh(): Promise<void> {
  const response = await fetch('/api/admin/external-links/health/refresh', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to trigger refresh');
  }
}
