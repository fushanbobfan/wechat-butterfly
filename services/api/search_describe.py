from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from typing import Any

from services.ml_inference_adapter import parse_describe_query


@dataclass
class DescribeQueryLog:
    raw_text: str
    parser_version: str
    parse_result: dict[str, Any]
    rule_hits: list[str]
    returned_candidates: list[dict[str, Any]]
    created_at: str


# Demo in-memory persistence; wire this to DB in production.
DESCRIBE_QUERY_LOGS: list[DescribeQueryLog] = []


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

    DESCRIBE_QUERY_LOGS.append(
        DescribeQueryLog(
            raw_text=text,
            parser_version=parse_result.parser_version,
            parse_result=response,
            rule_hits=parse_result.rule_hits,
            returned_candidates=parse_result.candidates,
            created_at=datetime.now(UTC).isoformat(),
        )
    )

    return response


def dump_logs() -> list[dict[str, Any]]:
    return [asdict(item) for item in DESCRIBE_QUERY_LOGS]
