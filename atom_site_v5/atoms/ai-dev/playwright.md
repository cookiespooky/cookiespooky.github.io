---
id: playwright
title: Playwright
slug: playwright
kind: tool
hub: tools
summary: 'Playwright — инструмент для управления браузером из кода: открытия страниц, кликов, заполнения форм, тестов и автоматизации пользовательских сценариев.'
status: public
links:
- id: browser-automation
  rel: implements
  strength: 0.55
  visibility: internal
  can_surface: false
- id: ai-agents
  rel: supports
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: automation
  rel: part_of
  strength: 0.65
  visibility: contextual
  can_surface: false
- id: lead-ai-mvp-build
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
actions:
- label: Разобрать сценарий автоматизации
  target: lead-ai-mvp-build
  help: Поможет понять, можно ли собрать нужное действие через браузер без официального API.
visibility: internal
role: implementation
audience:
- founder
- entrepreneur
- developer
routes:
- idea-to-mvp
surface_policy:
  can_be_main_topic: false
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  use_for_generation_context: true
  public_link_replacement: use_nearest_public_atom
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Playwright — инструмент для управления браузером из кода: открытия страниц, кликов, заполнения форм, тестов и автоматизации пользовательских сценариев.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
- Нельзя показывать этот атом как ссылку или главный раздел публичной статьи.
---

# Playwright

Playwright — инструмент для управления браузером из кода: открытия страниц, кликов, заполнения форм, тестов и автоматизации пользовательских сценариев.

Связанные элементы графа: [[browser-automation]], [[ai-agents]], [[automation]], [[lead-ai-mvp-build]].

## Связи

- [[browser-automation]] — implements
- [[ai-agents]] — supports
- [[automation]] — part_of
- [[lead-ai-mvp-build]] — leads_to

## Следующие действия

- **Разобрать сценарий автоматизации** → [[lead-ai-mvp-build]]: Поможет понять, можно ли собрать нужное действие через браузер без официального API.
