from __future__ import annotations

from pathlib import Path

from services.api.describe_query_log_repo import DescribeQueryLogRepository
from services.api import search_describe


def test_describe_log_repository_persists_jsonl(tmp_path: Path) -> None:
    repo = DescribeQueryLogRepository(tmp_path / "describe_log.jsonl")
    item = {
        "raw_text": "绿色有长尾",
        "parser_version": "2026.03.27",
        "parse_result": {"candidates": []},
        "rule_hits": ["RULE_LONG_TAIL_GREEN"],
        "returned_candidates": [],
        "created_at": "2026-03-27T00:00:00Z",
    }
    repo.append(item)

    rows = repo.dump()
    assert len(rows) == 1
    assert rows[0]["raw_text"] == "绿色有长尾"


def test_describe_search_writes_log_file(tmp_path: Path) -> None:
    repo = DescribeQueryLogRepository(tmp_path / "describe_log.jsonl")
    search_describe.DESCRIBE_QUERY_LOG_REPO = repo

    response = search_describe.describe_search({"text": "绿色有长尾"})

    assert response["parser_version"]
    logs = search_describe.dump_logs()
    assert len(logs) >= 1
    assert logs[-1]["raw_text"] == "绿色有长尾"
