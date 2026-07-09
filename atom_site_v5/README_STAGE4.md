# Atom Stage 4 Pack

Состав:

- `tests/generation_test_suite_v1.yaml` — пользовательские тестовые запросы.
- `tests/generation_contracts_v1.yaml` — ожидаемые ограничения для генерации.
- `outputs/*.md` — контрольные sample-outputs по v4-правилам.
- `prompts/system-prompt.md` — активный prompt v3.
- `reports/stage4_report.md` — выводы этапа.
- `reports/sample_output_audit.csv` — проверка sample-outputs.
- `reports/generation_defects_stage4.csv` — очередь дефектов.
- `reports/body_risk_audit.csv` — где остались старые автогенерированные блоки.
- `reports/body_wikilinks_to_internal.csv` — wikilinks на internal-атомы.
- `reports/broken_links_stage4.csv` — битые связи.

Важно: DeepSeek API не запускался. Это preflight и тестовый стенд. Следующий шаг — прогнать тесты на реальной модели и сверить с контрактами.
