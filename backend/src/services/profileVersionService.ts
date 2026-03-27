import { ProfileSnapshot, ProfileVersion } from '../types/profile';
import { buildDiffSummary, DiffSummary } from './snapshotDiff';
import { validatePublishGate } from './profilePublishGate';

export interface ProfileVersionRepo {
  getLatestVersion(profileId: number): Promise<ProfileVersion | null>;
  getLatestPublishedVersion(profileId: number): Promise<ProfileVersion | null>;
  getPreviousPublishedVersion(profileId: number): Promise<ProfileVersion | null>;
  createVersion(input: {
    profileId: number;
    versionNo: number;
    snapshotJson: ProfileSnapshot;
    sourceAction: 'submit' | 'publish' | 'rollback';
    createdBy: number;
    publishedAt?: string;
    rollbackFromVersionId?: number;
  }): Promise<ProfileVersion>;
  updateProfileSnapshot(profileId: number, snapshot: ProfileSnapshot): Promise<void>;
  writeAuditLog(input: {
    profileId: number;
    reviewerId: number;
    action: 'submit' | 'approve_publish' | 'reject' | 'rollback';
    diffSummary: DiffSummary;
    publishTime?: string;
    rollbackPointVersionId?: number;
  }): Promise<void>;
}

export class ProfileVersionService {
  constructor(private readonly repo: ProfileVersionRepo) {}

  async submit(profileId: number, snapshot: ProfileSnapshot, userId: number): Promise<ProfileVersion> {
    const latest = await this.repo.getLatestVersion(profileId);
    const nextVersionNo = (latest?.versionNo ?? 0) + 1;

    return this.repo.createVersion({
      profileId,
      versionNo: nextVersionNo,
      snapshotJson: snapshot,
      sourceAction: 'submit',
      createdBy: userId,
    });
  }

  async approveAndPublish(profileId: number, reviewedSnapshot: ProfileSnapshot, reviewerId: number) {
    const gate = validatePublishGate(reviewedSnapshot);
    if (!gate.ok) {
      throw new Error(`发布门禁校验失败: ${gate.errors.join('；')}`);
    }

    const latest = await this.repo.getLatestVersion(profileId);
    const previousPublished = await this.repo.getLatestPublishedVersion(profileId);
    const diffSummary = buildDiffSummary(previousPublished?.snapshotJson, reviewedSnapshot);
    const publishTime = new Date().toISOString();

    const publishedVersion = await this.repo.createVersion({
      profileId,
      versionNo: (latest?.versionNo ?? 0) + 1,
      snapshotJson: reviewedSnapshot,
      sourceAction: 'publish',
      createdBy: reviewerId,
      publishedAt: publishTime,
    });

    await this.repo.updateProfileSnapshot(profileId, reviewedSnapshot);

    await this.repo.writeAuditLog({
      profileId,
      reviewerId,
      action: 'approve_publish',
      diffSummary,
      publishTime,
    });

    return publishedVersion;
  }

  async rollbackToPreviousPublished(profileId: number, reviewerId: number): Promise<ProfileVersion> {
    const currentPublished = await this.repo.getLatestPublishedVersion(profileId);
    const previousPublished = await this.repo.getPreviousPublishedVersion(profileId);

    if (!currentPublished || !previousPublished) {
      throw new Error('没有可回滚的上一个已发布版本');
    }

    const rollbackSnapshot = previousPublished.snapshotJson;
    await this.repo.updateProfileSnapshot(profileId, rollbackSnapshot);

    const latest = await this.repo.getLatestVersion(profileId);
    const rollbackVersion = await this.repo.createVersion({
      profileId,
      versionNo: (latest?.versionNo ?? 0) + 1,
      snapshotJson: rollbackSnapshot,
      sourceAction: 'rollback',
      createdBy: reviewerId,
      rollbackFromVersionId: currentPublished.id,
    });

    const diffSummary = buildDiffSummary(currentPublished.snapshotJson, rollbackSnapshot);

    await this.repo.writeAuditLog({
      profileId,
      reviewerId,
      action: 'rollback',
      diffSummary,
      rollbackPointVersionId: currentPublished.id,
    });

    return rollbackVersion;
  }
}
