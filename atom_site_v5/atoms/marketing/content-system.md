---
id: content-system
title: Контентная система
slug: content-system
kind: tool
hub: topics
summary: Связанный набор тем, форматов и маршрутов, который ведет аудиторию от интереса к доверию и заявке.
status: public
links:
- id: positioning
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: icp
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: threads
  rel: related_to
  strength: 0.5
  visibility: internal
  can_surface: false
- id: offer
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: marketing-os
  rel: related_product
  strength: 0.55
  visibility: public
  can_surface: false
- id: lead-marketing-diagnostic
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: pillar-content
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: peripheral-content
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: content-to-leads
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: lead-content-map
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Построить контентную карту
  target: positioning
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Связать с Threads
  target: positioning
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Найти продающие темы
  target: positioning
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Разобрать мой маркетинг
  target: lead-marketing-diagnostic
  help: Поможет связать позиционирование, аудиторию, оффер и контент в одну маркетинговую карту.
- label: Собрать карту контента
  target: lead-content-map
  help: Поможет связать темы, оффер, комментарии, личку и заявки в один маршрут.
seo:
  title: Контентная система
  description: Связанный набор тем, форматов и маршрутов, который ведет аудиторию от интереса к доверию и заявке.
visibility: public
role: support_context
audience:
- entrepreneur
- founder
- expert
routes:
- content-to-leads
surface_policy:
  can_be_main_topic: false
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Связанный набор тем, форматов и маршрутов, который ведет аудиторию от интереса к доверию и заявке.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Контентная система

Связанный набор тем, форматов и маршрутов, который ведет аудиторию от интереса к доверию и заявке.

В контентной системе это отвечает за связку между вниманием и обращением: человек должен узнать свою ситуацию, понять предложение и увидеть естественный переход к диалогу.
