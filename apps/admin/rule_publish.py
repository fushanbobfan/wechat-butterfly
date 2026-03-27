from __future__ import annotations

from dataclasses import dataclass
from enum import StrEnum


class RuleStatus(StrEnum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    PUBLISHED = "published"


@dataclass
class RuleRevision:
    version: str
    content_path: str
    status: RuleStatus


class RulePublishService:
    def __init__(self) -> None:
        self._revisions: dict[str, RuleRevision] = {}

    def save_draft(self, version: str, content_path: str) -> RuleRevision:
        revision = RuleRevision(version=version, content_path=content_path, status=RuleStatus.DRAFT)
        self._revisions[version] = revision
        return revision

    def submit_review(self, version: str) -> RuleRevision:
        revision = self._must_get(version)
        revision.status = RuleStatus.PENDING_REVIEW
        return revision

    def publish(self, version: str) -> RuleRevision:
        revision = self._must_get(version)
        revision.status = RuleStatus.PUBLISHED
        return revision

    def _must_get(self, version: str) -> RuleRevision:
        if version not in self._revisions:
            raise KeyError(f"rule version {version} not found")
        return self._revisions[version]
