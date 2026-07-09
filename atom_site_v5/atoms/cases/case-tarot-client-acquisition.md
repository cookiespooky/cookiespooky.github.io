---
id: case-tarot-client-acquisition
title: Кейс таролога с повторными клиентами
slug: case-tarot-client-acquisition
kind: case
hub: research
summary: Кейс специалиста, у которого есть повторные оплаты и доверие, но нет устойчивой системы привлечения новых клиентов.
status: public
links:
- id: offer
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: threads
  rel: related_to
  strength: 0.5
  visibility: internal
  can_surface: false
- id: warm-lead
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: content-to-leads
  rel: explains
  strength: 0.75
  visibility: public
  can_surface: true
- id: lead-content-map
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Собрать карту контента
  target: lead-content-map
  help: Поможет превратить темы постов в маршрут к заявке.
- label: Посмотреть переход в личку
  target: comment-to-dm-flow
  help: Поможет продолжать интерес без резкой продажи.
seo:
  title: Кейс таролога с повторными клиентами
  description: Кейс специалиста, у которого есть повторные оплаты и доверие, но нет устойчивой системы привлечения новых клиентов.
visibility: contextual
role: proof
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Кейс специалиста, у которого есть повторные оплаты и доверие, но нет устойчивой системы привлечения новых клиентов.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Кейс таролога с повторными клиентами

Кейс показывает разрыв между качеством услуги и системой привлечения. Повторные обращения подтверждают ценность продукта, но входящий поток зависит от знакомых, рекомендаций и нерегулярного контента. Для роста нужны понятный Оффер, маршрут из Threads в диалог и карта тем, которые связывают запрос клиента с услугой.
