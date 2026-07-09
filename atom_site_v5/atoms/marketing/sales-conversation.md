---
id: sales-conversation
title: Продающий диалог
slug: sales-conversation
kind: process
hub: topics
summary: Диалог, в котором автор уточняет ситуацию человека, показывает связь с возможным решением и предлагает следующий шаг. Продажа строится на контексте, а не на давлении.
status: public
links:
- id: warm-lead
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: offer-context
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: objections-map
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: personal-analysis
  rel: related_to
  strength: 0.5
  visibility: hidden
  can_surface: false
- id: lead-content-map
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Подготовить вопросы
  target: objections-map
  help: Поможет заранее увидеть сомнения и недостающий контекст.
- label: Проверить оффер
  target: offer-context
  help: Поможет сделать предложение точным.
- label: Разобрать маршрут продажи
  target: lead-content-map
  help: Поможет связать контент и диалог с заявкой.
seo:
  title: Продающий диалог
  description: Диалог, в котором автор уточняет ситуацию человека, показывает связь с возможным решением и предлагает следующий шаг. Продажа строится на контексте, а не на давлении.
visibility: public
role: mechanism
audience:
- entrepreneur
- founder
- expert
routes:
- content-to-leads
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Диалог, в котором автор уточняет ситуацию человека, показывает связь с возможным решением и предлагает следующий шаг. Продажа строится на контексте, а не на давлении.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Продающий диалог

Диалог, в котором автор уточняет ситуацию человека, показывает связь с возможным решением и предлагает следующий шаг. Продажа строится на контексте, а не на давлении.

В контентной системе это отвечает за связку между вниманием и обращением: человек должен узнать свою ситуацию, понять предложение и увидеть естественный переход к диалогу.
