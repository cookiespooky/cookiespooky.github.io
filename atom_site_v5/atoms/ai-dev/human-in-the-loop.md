---
id: human-in-the-loop
title: Human-in-the-loop
slug: human-in-the-loop
kind: principle
hub: topics
summary: Human-in-the-loop — принцип, при котором человек сохраняет контроль над целью, проверкой и решениями, даже если модель выполняет большую часть технических операций.
status: public
links:
- id: model-as-developer
  rel: supports
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: ai-dev-workflow
  rel: part_of
  strength: 0.65
  visibility: contextual
  can_surface: false
- id: vibe-coding
  rel: clarifies
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: ai-assisted-refactoring
  rel: controls
  strength: 0.55
  visibility: contextual
  can_surface: false
actions:
- label: Настроить рабочий процесс
  target: ai-dev-workflow
  help: Поможет сделать AI-разработку управляемой, а не случайной перепиской с моделью.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Human-in-the-loop — принцип, при котором человек сохраняет контроль над целью, проверкой и решениями, даже если модель выполняет большую часть технических операций.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Human-in-the-loop

Human-in-the-loop — принцип, при котором человек сохраняет контроль над целью, проверкой и решениями, даже если модель выполняет большую часть технических операций.

В продуктовой работе это не самоцель, а способ проверить один риск: спрос, ценность, формат, дистрибуцию или техническую реализуемость без строительства большой системы заранее.
