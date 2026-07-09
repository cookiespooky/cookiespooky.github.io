---
id: case-route
title: Маршрут кейса
slug: case-route
kind: concept
hub: research
summary: Последовательность переходов от ситуации клиента к проблеме, механизму, методу, продукту и следующему действию.
status: public
links:
- id: case-pattern-library
  rel: part_of
  strength: 0.65
  visibility: contextual
  can_surface: false
- id: lead-action
  rel: leads_to
  strength: 0.9
  visibility: hidden
  can_surface: false
- id: cognitive-reconstruction
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: marketing-os
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
actions:
- label: Построить маршрут моего кейса
  target: lead-case-diagnostic
  help: Поможет понять, какой следующий шаг логичен именно из вашей ситуации.
seo:
  title: Маршрут кейса
  description: Последовательность переходов от ситуации клиента к проблеме, механизму, методу, продукту и следующему действию.
visibility: contextual
role: concept
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Последовательность переходов от ситуации клиента к проблеме, механизму, методу, продукту и следующему действию.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Маршрут кейса

Последовательность переходов от ситуации клиента к проблеме, механизму, методу, продукту и следующему действию.

В карте ситуации такие понятия полезны осторожно: они помогают заметить повторяющиеся роли, объяснения и конфликты, но не должны заменять факты, решения и конкретные действия.
