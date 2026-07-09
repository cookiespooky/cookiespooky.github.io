---
id: saas
title: SaaS
slug: saas
kind: model
hub: topics
summary: Продуктовая модель, где пользователь получает доступ к сервису по подписке или регулярной оплате.
status: public
links:
- id: mvp
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: hypothesis-testing
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: product-thinking
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: recca
  rel: related_product
  strength: 0.55
  visibility: public
  can_surface: false
- id: demand-validation
  rel: requires
  strength: 0.7
  visibility: public
  can_surface: true
- id: product-market-fit
  rel: aims_for
  strength: 0.55
  visibility: public
  can_surface: false
- id: build-trap
  rel: risk
  strength: 0.55
  visibility: public
  can_surface: false
actions:
- label: Проверить SaaS-идею
  target: mvp
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Связать с MVP
  target: lead-ai-development
  help: Поможет быстро перейти от идеи к рабочему прототипу или понятному техническому плану.
- label: Посмотреть риски
  target: mvp
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Проверить SaaS-гипотезу
  target: lead-startup-diagnostic
  help: Поможет выбрать минимальный тест спроса до лишней разработки.
seo:
  title: SaaS
  description: Продуктовая модель, где пользователь получает доступ к сервису по подписке или регулярной оплате.
visibility: public
role: support_context
audience:
- founder
- entrepreneur
routes:
- idea-to-mvp
surface_policy:
  can_be_main_topic: false
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Продуктовая модель, где пользователь получает доступ к сервису по подписке или регулярной оплате.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# SaaS

Продуктовая модель, где пользователь получает доступ к сервису по подписке или регулярной оплате.

В продуктовой работе это не самоцель, а способ проверить один риск: спрос, ценность, формат, дистрибуцию или техническую реализуемость без строительства большой системы заранее.
