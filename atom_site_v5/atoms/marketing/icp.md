---
id: icp
title: ICP
slug: icp
kind: concept
hub: topics
summary: Описание конкретного типа клиента, для которого проблема, оффер и контекст покупки совпадают особенно сильно.
status: public
links:
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
- id: content-system
  rel: compatible_with
  strength: 0.55
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
- id: narrow-pain-post
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: objections-map
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
actions:
- label: Разобрать маркетинг
  target: lead-marketing-diagnostic
  help: Связать аудиторию, боль и оффер в проверяемую гипотезу.
- label: Проверить оффер
  target: offer
  help: Посмотреть, что именно предлагается этому типу клиента.
seo:
  title: ICP
  description: Описание конкретного типа клиента, для которого проблема, оффер и контекст покупки совпадают особенно сильно.
visibility: public
role: concept
audience:
- entrepreneur
- founder
- expert
routes:
- product-to-offer
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- Можно говорить, что ICP описывает не просто демографию, а ситуацию, боль, контекст и готовность к действию.
- Можно говорить, что узкий ICP делает оффер и контент конкретнее.
- Можно говорить, что ICP проверяется реакцией и обращениями, а не только рассуждением.
forbidden_claims:
- Нельзя сводить ICP к возрасту, полу или должности без ситуации и боли.
- Нельзя утверждать, что один ICP навсегда закрывает все сегменты.
- Нельзя обещать гарантированный результат, продажи, ясность или успешный запуск.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать внутренние инструменты, платформы или технические детали в публичный следующий шаг для нетехнической аудитории.
- 'Нельзя добавлять ссылки на атомы с visibility: internal или can_surface: false.'
user_problem: Аудитория описана слишком широко, поэтому оффер и контент говорят со всеми сразу и ни с кем конкретно.
input:
- текущие клиенты или желаемая аудитория
- ситуации, где проблема проявляется сильнее всего
- боли, триггеры и ограничения
- признаки готовности платить или обращаться
output:
- узкий сегмент аудитории
- ситуация покупки или обращения
- язык боли и критерии релевантности
---

# ICP

ICP — это не “женщины 25–45” и не “малый бизнес”. Это конкретный тип клиента, у которого проблема, контекст, срочность и готовность к действию совпадают особенно сильно.

Слабый ICP описывает людей так широко, что под него подходит половина интернета и трое соседей. Рабочий ICP описывает ситуацию: что у человека происходит, почему это важно сейчас, какие альтернативы он уже пробовал и по каким словам узнает свою проблему.

Чем точнее ICP, тем проще писать контент, собирать оффер и понимать, где искать первых клиентов. Узость здесь не тюрьма, а линза.
