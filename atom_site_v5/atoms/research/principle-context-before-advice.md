---
id: principle-context-before-advice
title: Сначала контекст, потом совет
slug: principle-context-before-advice
kind: principle
hub: research
summary: Совет полезен, когда известны цель, ограничения, текущий этап, ресурсы, повторяющиеся сценарии и критерий результата.
status: public
links:
- id: case-route
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: cognitive-reconstruction
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: situation-map
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: lead-case-diagnostic
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
actions:
- label: Сопоставить с кейсом
  target: lead-case-diagnostic
  help: Поможет сравнить вашу ситуацию с похожими структурами и выбрать точку разбора.
- label: Построить карту ситуации
  target: situation-map
  help: Поможет собрать контекст до выбора действия.
seo:
  title: Сначала контекст, потом совет
  description: Совет полезен, когда известны цель, ограничения, текущий этап, ресурсы, повторяющиеся сценарии и критерий результата.
visibility: public
role: mechanism
audience:
- expert
- founder
- researcher
- entrepreneur
routes:
- chaos-to-focus
- situation-to-map
- notes-to-system
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Совет полезен, когда известны цель, ограничения, текущий этап, ресурсы, повторяющиеся сценарии и критерий результата.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Сначала контекст, потом совет

Совет полезен, когда известны цель, ограничения, текущий этап, ресурсы, повторяющиеся сценарии и критерий результата.

Одинаковый совет может быть полезным в одном контексте и вредным в другом. Поэтому граф сайта сначала уточняет маршрут пользователя, а не сразу выдает универсальную рекомендацию.

Кейсы, карты ситуаций и реконструкция нужны для того, чтобы совет опирался на структуру, а не на красивую фразу.

## Связанные элементы

Маршрут кейса · Когнитивная реконструкция · Карта ситуации · Диагностика кейса
