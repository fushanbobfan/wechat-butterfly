from __future__ import annotations

import json
from pathlib import Path


def test_game_config_contract_has_required_fields() -> None:
    config_path = Path(__file__).resolve().parents[1] / "services" / "api" / "src" / "data" / "game-configs.json"
    payload = json.loads(config_path.read_text(encoding="utf-8"))

    assert payload["config_id"]
    assert payload["version"]
    assert payload["locale"]
    assert isinstance(payload["questions"], list)
    assert len(payload["questions"]) >= 1

    first = payload["questions"][0]
    for field in [
        "id",
        "mode",
        "stem",
        "topic",
        "difficulty",
        "age_band",
        "taxon_id",
        "trait_tag",
        "options",
        "explanation",
    ]:
        assert field in first

    assert first["explanation"]["error_template"]
    assert first["explanation"]["details"]
