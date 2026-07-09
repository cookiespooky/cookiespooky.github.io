---
id: storefront
title: Storefront
slug: storefront
kind: tool
hub: products
summary: Storefront — формат продуктовой витрины, где несколько офферов собраны в одном понятном интерфейсе с описанием, ценностью и действиями.
status: public
links:
- id: product-showcase
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: recca
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: offer-card
  rel: contains
  strength: 0.55
  visibility: public
  can_surface: false
- id: expert-offers
  rel: shows
  strength: 0.55
  visibility: public
  can_surface: false
- id: mini-products
  rel: contains
  strength: 0.55
  visibility: public
  can_surface: false
actions:
- label: Посмотреть витрину продукта
  target: product-showcase
  help: Поможет понять, из каких блоков собирается storefront.
- label: Собрать storefront
  target: lead-recca-network
  help: Поможет превратить офферы в страницу, которую можно показывать аудитории и партнерам.
seo:
  title: Storefront
  description: Storefront — формат продуктовой витрины, где несколько офферов собраны в одном понятном интерфейсе с описанием, ценностью и действиями.
visibility: public
role: offer
audience:
- entrepreneur
- founder
- expert
routes:
- product-to-offer
- content-to-leads
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Storefront — формат продуктовой витрины, где несколько офферов собраны в одном понятном интерфейсе с описанием, ценностью и действиями.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Storefront

Storefront — формат продуктовой витрины, где несколько офферов собраны в одном понятном интерфейсе с описанием, ценностью и действиями.

Storefront нужен, когда у автора или проекта несколько предложений, и их нужно показать без превращения страницы в каталог ради каталога.
