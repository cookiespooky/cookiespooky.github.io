---
id: case-founder-too-many-projects
title: Кейс фаундера с избытком проектов
slug: case-founder-too-many-projects
kind: case
hub: research
summary: Кейс человека, который видит много перспективных направлений и из-за этого не доводит один продукт до проверки спроса.
status: public
links:
- id: too-many-ideas
  rel: explains
  strength: 0.75
  visibility: hidden
  can_surface: false
- id: product-choice
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: demand-validation
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: system-before-sales
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: lead-startup-diagnostic
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Выбрать главный продукт
  target: product-choice
  help: Поможет отделить рабочую гипотезу от красивого набора возможностей.
- label: Проверить спрос
  target: lead-startup-diagnostic
  help: Поможет определить минимальное действие до разработки.
seo:
  title: Кейс фаундера с избытком проектов
  description: Кейс человека, который видит много перспективных направлений и из-за этого не доводит один продукт до проверки спроса.
visibility: public
role: proof
audience:
- founder
- entrepreneur
routes:
- chaos-to-focus
- idea-to-mvp
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Кейс человека, который видит много перспективных направлений и из-за этого не доводит один продукт до проверки спроса.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Кейс фаундера с избытком проектов

Кейс описывает состояние, где каждая идея выглядит логичной, но суммарно они создают перегруз. Проблема находится не только в планировании, а в отсутствии критерия выбора и проверки спроса. Рабочий маршрут проходит через Выбор продукта, MVP, Проверка спроса и startup diagnostic.
