---
id: sage-archetype
title: Архетип мудреца
slug: sage-archetype
kind: concept
hub: research
summary: Роль исследователя, который ищет закономерности, объяснения, принципы и устойчивую картину мира.
status: public
links:
- id: archetypes
  rel: example_of
  strength: 0.6
  visibility: contextual
  can_surface: false
- id: research
  rel: related_to
  strength: 0.5
  visibility: internal
  can_surface: false
- id: world-model
  rel: produces
  strength: 0.8
  visibility: contextual
  can_surface: false
- id: complexity-preservation
  rel: risk
  strength: 0.55
  visibility: hidden
  can_surface: false
actions:
- label: Посмотреть картину мира
  target: world-model
  help: Поможет понять, какую систему объяснений человек уже использует.
- label: Увидеть риск сложности
  target: complexity-preservation
  help: Поможет отличить исследование от удерживания лишней сложности.
- label: Перейти к исследованиям
  target: research
  help: Поможет продолжить путь через авторские наблюдения и принципы.
seo:
  title: Архетип мудреца
  description: Роль исследователя, который ищет закономерности, объяснения, принципы и устойчивую картину мира.
visibility: contextual
role: concept
audience:
- entrepreneur
- founder
- expert
- researcher
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Роль исследователя, который ищет закономерности, объяснения, принципы и устойчивую картину мира.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Архетип мудреца

Архетип мудреца связан с поиском закономерностей и объяснений. Он усиливает исследовательскую глубину, но может задерживать действие, если понимание становится самоцелью. Для сайта этот атом связывает философский слой с методами анализа и продуктовой практикой.

Связи: Архетипы, Исследования, Картина мира, complexity preservation.
