---
id: marketing-os
title: Marketing OS
slug: marketing-os
kind: product
hub: products
summary: 'Система для сборки маркетинговой логики: аудитория, боль, оффер, контент, путь к диалогу и заявке.'
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
- id: content-system
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: offer
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: cognitive-reconstruction
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: product-thinking
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: lead-marketing-diagnostic
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: content-diagnostics
  rel: uses
  strength: 0.7
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
- label: Разобрать маркетинг
  target: lead-marketing-diagnostic
  help: Понять, где рвется связка между продуктом, аудиторией, оффером и заявками.
- label: Собрать карту контента
  target: lead-content-map
  help: Связать темы, боли и путь к обращению.
seo:
  title: Marketing OS
  description: 'Система для сборки маркетинговой логики: аудитория, боль, оффер, контент, путь к диалогу и заявке.'
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
  show_on_home: true
  show_in_nav: true
  max_outbound_links: 3
allowed_claims:
- Можно говорить, что Marketing OS связывает продукт, аудиторию, оффер, контент и путь клиента.
- Можно говорить, что система помогает найти разрыв между тем, что продается, и тем, как это объясняется.
- Можно говорить, что результатом может быть карта маркетинговой логики и следующий тест.
forbidden_claims:
- Нельзя обещать рост заявок без проверки оффера, аудитории и канала.
- Нельзя сводить маркетинг только к текстам или упаковке.
- Нельзя обещать гарантированный результат, продажи, ясность или успешный запуск.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать внутренние инструменты, платформы или технические детали в публичный следующий шаг для нетехнической аудитории.
- 'Нельзя добавлять ссылки на атомы с visibility: internal или can_surface: false.'
user_problem: Продукт есть, но его сложно объяснить, контент не приводит к понятным обращениям, а оффер звучит слишком широко.
input:
- описание продукта или услуги
- текущий оффер, сайт, посты или переписки
- гипотезы по аудитории и болям
output:
- карта аудитории, боли и оффера
- понятный маршрут от интереса к заявке
- список правок и проверок
---

# Marketing OS

Marketing OS нужен, когда продукт вроде есть, но рынок слышит не продукт, а туман с красивым шрифтом. Внутри может быть сильная экспертиза, но снаружи человек не понимает: для кого это, какую задачу решает, с чем приходить и какой шаг сделать дальше.

Система собирает маркетинговую логику в одну карту: аудитория, боль, ситуация, оффер, контент, доказательства, путь к диалогу и заявке. Это не про “упаковать красиво”, а про связать смысл продукта с реальным запросом человека.

Результат — яснее сформулированный продукт, понятный оффер, карта контента и список проверок, которые показывают, где есть спрос, а где пока только внутреннее ощущение “ну это же очевидно”.
