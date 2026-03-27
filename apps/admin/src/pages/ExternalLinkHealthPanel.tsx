import { useEffect, useMemo, useState } from 'react';
import {
  fetchExternalLinkHealth,
  triggerExternalLinkHealthRefresh,
  type ExternalLinkHealthItem,
} from '../services/externalLinkHealthApi';

export function ExternalLinkHealthPanel(): JSX.Element {
  const [items, setItems] = useState<ExternalLinkHealthItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unhealthyCount = useMemo(
    () => items.filter((item) => !item.available).length,
    [items],
  );

  const load = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const nextItems = await fetchExternalLinkHealth();
      setItems(nextItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    setError(null);

    try {
      await triggerExternalLinkHealthRefresh();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <section>
      <h2>外链健康状态</h2>
      <p>异常链接: {unhealthyCount}</p>
      <button onClick={() => void onRefresh()} disabled={refreshing}>
        {refreshing ? '刷新中...' : '手动触发刷新'}
      </button>

      {loading ? <p>加载中...</p> : null}
      {error ? <p role="alert">{error}</p> : null}

      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>URL</th>
            <th>Status</th>
            <th>Code</th>
            <th>摘要降级内容</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={`${item.provider}:${item.url}`}>
              <td>{item.provider}</td>
              <td>
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.url}
                </a>
              </td>
              <td>{item.available ? '健康' : '降级'}</td>
              <td>{item.statusCode ?? '-'}</td>
              <td>{item.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
