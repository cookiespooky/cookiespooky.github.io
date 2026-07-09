---
id: threads
title: Threads
slug: threads
kind: channel
hub: topics
summary: Канал короткого контента, быстрых реакций, тестирования формулировок и привлечения аудитории.
status: public
links:
- id: content-system
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: positioning
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
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
- id: threads-content-loop
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: comment-to-dm-flow
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: lead-content-map
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Найти углы для Threads
  target: content-system
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Проверить посты
  target: content-system
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Связать с оффером
  target: content-system
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Разобрать мой маркетинг
  target: lead-marketing-diagnostic
  help: Поможет связать позиционирование, аудиторию, оффер и контент в одну маркетинговую карту.
- label: Собрать карту контента
  target: lead-content-map
  help: Поможет связать темы, оффер, комментарии, личку и заявки в один маршрут.
seo:
  title: Threads
  description: Канал короткого контента, быстрых реакций, тестирования формулировок и привлечения аудитории.
visibility: internal
role: implementation
audience:
- entrepreneur
- founder
- expert
- developer
routes:
- content-to-leads
- product-to-offer
surface_policy:
  can_be_main_topic: false
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  use_for_generation_context: true
  public_link_replacement: use_nearest_public_atom
  public_label_replacement: короткий контент
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Канал короткого контента, быстрых реакций, тестирования формулировок и привлечения аудитории.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
- Нельзя показывать этот атом как ссылку или главный раздел публичной статьи.
- Нельзя использовать платформу как публичный маршрут; заменять на нейтральное “короткий контент”.
---

# Threads

Канал короткого контента, быстрых реакций, тестирования формулировок и привлечения аудитории.

Связанные элементы графа: [[content-system|Контентная система]], [[positioning|Позиционирование]], [[offer|Оффер]], [[marketing-os|Marketing OS]], [[lead-marketing-diagnostic|Диагностика маркетинга]].

## Связи

- [[content-system]] — compatible_with
- [[positioning]] — uses
- [[offer]] — related_to
- [[marketing-os]] — related_product
- [[lead-marketing-diagnostic]] — leads_to

## Следующие действия

- **Найти углы для Threads** → [[content-system]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
- **Проверить посты** → [[content-system]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
- **Связать с оффером** → [[content-system]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
- **Разобрать мой маркетинг** → [[lead-marketing-diagnostic]]: Поможет связать позиционирование, аудиторию, оффер и контент в одну маркетинговую карту.
