---
id: technical-spec-from-idea
title: Техническое ТЗ из идеи
slug: technical-spec-from-idea
kind: method
hub: methods
summary: 'Техническое ТЗ из идеи — перевод свободного описания продукта в структуру: цель, пользовательский сценарий, данные, интерфейс, ограничения и первый проход разработки.'
status: public
links:
- id: prompt-brief
  rel: produces
  strength: 0.8
  visibility: internal
  can_surface: false
- id: ai-dev-workflow
  rel: starts
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: mvp
  rel: supports
  strength: 0.55
  visibility: public
  can_surface: false
- id: product-thinking
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
actions:
- label: Собрать ТЗ для идеи
  target: lead-ai-mvp-build
  help: Поможет перейти от размытой задумки к задаче, которую можно разработать через AI или обычным способом.
visibility: contextual
role: implementation
audience:
- founder
- entrepreneur
- developer
routes: &id001
- idea-to-mvp
surface_policy:
  can_be_main_topic: false
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  show_only_in_routes: *id001
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Техническое ТЗ из идеи — перевод свободного описания продукта в структуру: цель, пользовательский сценарий, данные, интерфейс, ограничения и первый проход разработки.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Техническое ТЗ из идеи

Техническое ТЗ из идеи — перевод свободного описания продукта в структуру: цель, пользовательский сценарий, данные, интерфейс, ограничения и первый проход разработки.

В продуктовой работе это не самоцель, а способ проверить один риск: спрос, ценность, формат, дистрибуцию или техническую реализуемость без строительства большой системы заранее.
