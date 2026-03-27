from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

try:
    import yaml
except Exception:  # pragma: no cover - optional runtime dependency
    yaml = None


@dataclass(frozen=True)
class Rule:
    id: str
    pattern: str
    candidate: str
    confidence: float


@dataclass(frozen=True)
class RuleSet:
    version: str
    uncertain_terms: list[str]
    rules: list[Rule]


DEFAULT_RULE_PATH = Path(__file__).resolve().parents[3] / "configs" / "parser" / "describe_rules.json"


def _read_payload(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    if path.suffix.lower() == ".json":
        return json.loads(text)
    if path.suffix.lower() in {".yaml", ".yml"}:
        if yaml is None:
            raise RuntimeError("PyYAML is required to load YAML parser rules.")
        return yaml.safe_load(text)
    raise ValueError(f"Unsupported rule file type: {path}")


def load_rules(path: Path | None = None) -> RuleSet:
    rule_path = path or DEFAULT_RULE_PATH
    payload = _read_payload(rule_path)
    version = payload.get("version", "0.0.0")
    uncertain_terms = payload.get("uncertain_terms", [])
    rules = [
        Rule(
            id=item["id"],
            pattern=item["pattern"],
            candidate=item["candidate"],
            confidence=float(item.get("confidence", 0.5)),
        )
        for item in payload.get("rules", [])
    ]
    return RuleSet(version=version, uncertain_terms=uncertain_terms, rules=rules)
