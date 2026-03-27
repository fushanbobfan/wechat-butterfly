from __future__ import annotations

from dataclasses import dataclass

from .rules import RuleSet, load_rules


@dataclass
class DescribeParseResult:
    parser_version: str
    candidates: list[dict]
    rule_hits: list[str]
    uncertain_terms: list[str]


def parse_describe_query(text: str, ruleset: RuleSet | None = None) -> DescribeParseResult:
    ruleset = ruleset or load_rules()
    normalized = text.strip().lower()

    hits: list[str] = []
    candidates: list[dict] = []
    uncertain_terms = [term for term in ruleset.uncertain_terms if term in normalized]

    for rule in ruleset.rules:
        if rule.pattern in normalized:
            hits.append(rule.id)
            candidates.append(
                {
                    "name": rule.candidate,
                    "confidence": rule.confidence,
                    "source_rule": rule.id,
                }
            )

    return DescribeParseResult(
        parser_version=ruleset.version,
        candidates=candidates,
        rule_hits=hits,
        uncertain_terms=uncertain_terms,
    )
