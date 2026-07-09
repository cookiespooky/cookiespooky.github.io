---
id: "world-model"
title: "Картина мира"
slug: "world-model"
kind: "concept"
hub: "research"
summary: "Система представлений, через которую человек объясняет события, причины, возможности и ограничения."
status: "public"
links:
- id: "lat"
  rel: "uses"
  strength: 0.7
  visibility: public
  can_surface: true
- id: "identity"
  rel: "related_to"
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: "agency"
  rel: "related_to"
  strength: 0.5
  visibility: public
  can_surface: false
- id: "causality"
  rel: "related_to"
  strength: 0.5
  visibility: public
  can_surface: false
actions:
- label: "Понять модель мира"
  target: "lat"
  help: "Поможет уточнить контекст и перейти к следующему связанному понятию."
- label: "Связать с речью"
  target: "lat"
  help: "Поможет уточнить контекст и перейти к следующему связанному понятию."
- label: "Найти ограничения"
  target: "lat"
  help: "Поможет уточнить контекст и перейти к следующему связанному понятию."
seo:
  title: "Картина мира"
  description: "Система представлений, через которую человек объясняет события, причины, возможности и ограничения."
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Система представлений, через которую человек объясняет события, причины, возможности и ограничения.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Картина мира

Система представлений, через которую человек объясняет события, причины, возможности и ограничения.

В карте ситуации такие понятия полезны осторожно: они помогают заметить повторяющиеся роли, объяснения и конфликты, но не должны заменять факты, решения и конкретные действия.
