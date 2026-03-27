import { ProfileSnapshot, PublishGateResult } from '../types/profile';

const REQUIRED_BASE_TAGS = ['category', 'region', 'language'];

export function validatePublishGate(snapshot: ProfileSnapshot): PublishGateResult {
  const errors: string[] = [];

  if (!snapshot.mainImage?.trim()) {
    errors.push('必须有主图');
  }

  if (!snapshot.externalLinks?.some((link) => isAuthorityLink(link.url))) {
    errors.push('至少一个外部权威链接');
  }

  const normalizedTags = (snapshot.tags ?? []).map((tag) => tag.toLowerCase());
  const missingBaseTags = REQUIRED_BASE_TAGS.filter((tag) => !normalizedTags.includes(tag));
  if (missingBaseTags.length > 0) {
    errors.push(`基础标签不完整，缺少: ${missingBaseTags.join(', ')}`);
  }

  if (!snapshot.source?.trim()) {
    errors.push('来源字段不能为空');
  }

  if (!snapshot.authorization?.trim()) {
    errors.push('授权字段不能为空');
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

function isAuthorityLink(url: string): boolean {
  return /https?:\/\/(www\.)?(gov|edu|org|who\.int|un\.org|wikipedia\.org)/i.test(url);
}
