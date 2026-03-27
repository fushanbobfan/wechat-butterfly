from __future__ import annotations

import json
from pathlib import Path
from typing import Any


class DescribeQueryLogRepository:
    def __init__(self, file_path: Path | None = None) -> None:
        default_path = Path(__file__).resolve().parents[2] / "artifacts" / "describe_query_log.jsonl"
        self.file_path = file_path or default_path
        self.file_path.parent.mkdir(parents=True, exist_ok=True)

    def append(self, item: dict[str, Any]) -> None:
        line = json.dumps(item, ensure_ascii=False)
        with self.file_path.open("a", encoding="utf-8") as fp:
            fp.write(f"{line}\n")

    def dump(self) -> list[dict[str, Any]]:
        if not self.file_path.exists():
            return []

        rows: list[dict[str, Any]] = []
        for line in self.file_path.read_text(encoding="utf-8").splitlines():
            if line.strip():
                rows.append(json.loads(line))
        return rows
