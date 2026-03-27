from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from typing import Any

from services.api.describe_query_log_repo import DescribeQueryLogRepository
from services.ml_inference_adapter import parse_describe_query


@dataclass
class DescribeQueryLog:
    raw_text: str
    parser_version: str
    parse_result: dict[str, Any]
    rule_hits: list[str]
    returned_candidates: list[dict[str, Any]]
    created_at: str


DESCRIBE_QUERY_LOG_REPO = DescribeQueryLogRepository()


def describe_search(payload: dict[str, Any]) -> dict[str, Any]:
    text = str(payload.get("text", "")).strip()
    parse_result = parse_describe_query(text)

    response = {
        "text": text,
        "candidates": parse_result.candidates,
        "parser_version": parse_result.parser_version,
        "rule_hits": parse_result.rule_hits,
        "uncertain_terms": parse_result.uncertain_terms,
    }

    log_item = DescribeQueryLog(
        raw_text=text,
        parser_version=parse_result.parser_version,
        parse_result=response,
        rule_hits=parse_result.rule_hits,
        returned_candidates=parse_result.candidates,
        created_at=datetime.now(UTC).isoformat(),
    )
    DESCRIBE_QUERY_LOG_REPO.append(asdict(log_item))

    return response


def dump_logs() -> list[dict[str, Any]]:
    return DESCRIBE_QUERY_LOG_REPO.dump()
