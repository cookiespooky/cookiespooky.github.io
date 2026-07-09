---
id: lead-case-diagnostic
title: Диагностика кейса
slug: lead-case-diagnostic
kind: action
hub: products
summary: 'Разбор собственного запроса через похожий кейс: что совпадает, где отличие и какую карту ситуации стоит собрать.'
status: public
links:
- id: case-pattern-library
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: case-route
  rel: produces
  strength: 0.8
  visibility: contextual
  can_surface: false
- id: situation-map
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: cognitive-reconstruction
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
actions:
- label: Описать свою ситуацию
  target: lead-case-diagnostic
  help: Поможет сопоставить ваш запрос с похожими кейсами и выбрать точку разбора.
seo:
  title: Диагностика кейса
  description: 'Разбор собственного запроса через похожий кейс: что совпадает, где отличие и какую карту ситуации стоит собрать.'
visibility: contextual
role: lead_action
audience:
- entrepreneur
- founder
- expert
routes: &id001
- situation-to-map
surface_policy:
  can_be_main_topic: true
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  show_only_in_routes: *id001
allowed_claims:
- 'Можно использовать утверждения, прямо опирающиеся на смысл атома: Разбор собственного запроса через похожий кейс: что совпадает, где отличие и какую карту ситуации стоит собрать.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---

# Диагностика через кейс

Диагностика через кейс подходит, когда вы узнаете свою ситуацию в чужой истории, но не хотите просто копировать чужое решение. Похожий кейс может дать язык и ориентиры, но свою структуру все равно нужно собрать отдельно.

В разборе сравниваются контекст, проблема, ограничения, действия и результат кейса с вашей ситуацией. Так становится видно, что действительно применимо, а что является частным обстоятельством другого человека.

Итог — не “делайте как он”, а карта собственного запроса: что похоже, что отличается и какой следующий шаг разумно проверить.
