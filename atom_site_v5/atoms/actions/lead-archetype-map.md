---
id: lead-archetype-map
title: Карта архетипов и личного мифа
slug: lead-archetype-map
kind: action
hub: products
summary: Входное действие для разбора личного мифа, архетипов, повторяющихся сценариев и их связи с позиционированием или выбором направления.
status: public
links:
- id: archetypes
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: personal-myth
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: narrative-positioning
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
- label: Начать с личного мифа
  target: personal-myth
  help: Поможет собрать основной сюжет и роли.
- label: Связать с позиционированием
  target: narrative-positioning
  help: Поможет превратить сюжет в понятное описание для аудитории.
- label: Разобрать ситуацию глубже
  target: cognitive-reconstruction
  help: Поможет связать архетипический слой с картой фактов, решений и действий.
seo:
  title: Карта архетипов и личного мифа
  description: Входное действие для разбора личного мифа, архетипов, повторяющихся сценариев и их связи с позиционированием или выбором направления.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Входное действие для разбора личного мифа, архетипов, повторяющихся сценариев и их связи с позиционированием или выбором направления.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Карта архетипов и личного мифа

Карта архетипов и личного мифа помогает описать повторяющиеся роли, конфликты и сюжеты, которые влияют на выбор направления, позиционирование и публичный образ. Это действие подходит, когда человеку важно не только выбрать продукт, но и понять, из какой роли он действует.

Связанные элементы: Архетипы, Личный миф, Нарративное позиционирование, Когнитивная реконструкция.
