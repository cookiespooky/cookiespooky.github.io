---
id: case-intake-form
title: Форма сбора кейса
slug: case-intake-form
kind: tool
hub: tools
summary: Минимальная форма, которая собирает контекст кейса без превращения пользователя в заложника анкеты.
status: public
links:
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
- id: lead-case-diagnostic
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
- id: cognitive-reconstruction
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
actions:
- label: Собрать вводные
  target: lead-case-diagnostic
  help: Поможет начать разбор с фактов и контекста.
seo:
  title: Форма сбора кейса
  description: Минимальная форма, которая собирает контекст кейса без превращения пользователя в заложника анкеты.
visibility: contextual
role: support_context
audience:
- entrepreneur
- founder
- expert
routes: &id001
- situation-to-map
surface_policy:
  can_be_main_topic: false
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  show_only_in_routes: *id001
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Минимальная форма, которая собирает контекст кейса без превращения пользователя в заложника анкеты.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Форма сбора кейса

Форма сбора кейса должна получать только материал, нужный для первичной диагностики: что происходит, что уже пробовали, какой результат нужен, где застревание, какие есть факты. Ее задача — подготовить данные для Маршрут кейса, Карта ситуации и Диагностика кейса.
