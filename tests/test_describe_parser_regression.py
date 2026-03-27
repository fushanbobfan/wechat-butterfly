from __future__ import annotations

import json
from pathlib import Path

from services.api.search_describe import describe_search
from services.ml_inference.parser.rules import load_rules


def test_rule_config_has_version() -> None:
    rules = load_rules()
    assert rules.version
    assert len(rules.rules) >= 1


def test_regression_samples() -> None:
    fixture_path = Path(__file__).parent / "regression" / "describe_samples.json"
    samples = json.loads(fixture_path.read_text(encoding="utf-8"))

    for sample in samples:
        response = describe_search({"text": sample["text"]})

        for expected_hit in sample.get("expect_rule_hits", []):
            assert expected_hit in response["rule_hits"]

        names = {item["name"] for item in response["candidates"]}
        for name in sample.get("must_include_candidates", []):
            assert name in names

        for term in sample.get("expect_uncertain_terms", []):
            assert term in response["uncertain_terms"]

        assert response["parser_version"] == load_rules().version
