import React from 'react';

type ProfileSnapshot = {
  title: string;
  description?: string;
  mainImage?: string;
  tags: string[];
  externalLinks: Array<{ url: string; title?: string }>;
  source: string;
  authorization: string;
};

type Props = {
  oldSnapshot?: ProfileSnapshot;
  newSnapshot: ProfileSnapshot;
};

export function ProfileDiffView({ oldSnapshot, newSnapshot }: Props) {
  return (
    <div className="profile-diff-view">
      <h3>文本字段差异</h3>
      <DiffRow label="标题" before={oldSnapshot?.title} after={newSnapshot.title} />
      <DiffRow label="简介" before={oldSnapshot?.description} after={newSnapshot.description} />
      <DiffRow label="来源" before={oldSnapshot?.source} after={newSnapshot.source} />
      <DiffRow label="授权" before={oldSnapshot?.authorization} after={newSnapshot.authorization} />

      <h3>标签差异</h3>
      <DiffRow label="标签" before={oldSnapshot?.tags ?? []} after={newSnapshot.tags} />

      <h3>图片差异</h3>
      <DiffRow label="主图" before={oldSnapshot?.mainImage} after={newSnapshot.mainImage} asImage />

      <h3>外链差异</h3>
      <DiffRow
        label="外链"
        before={(oldSnapshot?.externalLinks ?? []).map((x) => x.url)}
        after={(newSnapshot.externalLinks ?? []).map((x) => x.url)}
      />
    </div>
  );
}

function DiffRow({
  label,
  before,
  after,
  asImage,
}: {
  label: string;
  before: unknown;
  after: unknown;
  asImage?: boolean;
}) {
  const changed = JSON.stringify(before) !== JSON.stringify(after);

  if (asImage) {
    return (
      <div className={`diff-row ${changed ? 'changed' : ''}`}>
        <strong>{label}</strong>
        <div className="diff-cell">{renderImage(before as string | undefined)}</div>
        <div className="diff-cell">{renderImage(after as string | undefined)}</div>
      </div>
    );
  }

  return (
    <div className={`diff-row ${changed ? 'changed' : ''}`}>
      <strong>{label}</strong>
      <pre className="diff-cell">{formatValue(before)}</pre>
      <pre className="diff-cell">{formatValue(after)}</pre>
    </div>
  );
}

function renderImage(src?: string) {
  if (!src) return <em>无</em>;
  return <img src={src} alt="profile" style={{ width: 120, height: 120, objectFit: 'cover' }} />;
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') return value;
  return JSON.stringify(value ?? null, null, 2);
}
