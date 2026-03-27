export type ProfileSnapshot = {
  id: number;
  title: string;
  description?: string;
  mainImage?: string;
  tags: string[];
  externalLinks: Array<{
    url: string;
    title?: string;
    authority?: string;
  }>;
  source: string;
  authorization: string;
  updatedAt: string;
};

export type ProfileVersion = {
  id: number;
  profileId: number;
  versionNo: number;
  snapshotJson: ProfileSnapshot;
  sourceAction: 'submit' | 'publish' | 'rollback';
  createdBy: number;
  createdAt: string;
  publishedAt?: string;
  rollbackFromVersionId?: number;
};

export type PublishGateResult = {
  ok: boolean;
  errors: string[];
};
