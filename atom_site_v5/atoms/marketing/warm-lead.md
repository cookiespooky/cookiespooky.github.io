---
id: warm-lead
title: Теплый лид
slug: warm-lead
kind: persona
hub: topics
summary: Человек, который уже проявил интерес к теме, проблеме, материалу или действию. С ним важно продолжать диалог из его контекста, а не начинать продажу с нуля.
status: public
links:
- id: comment-to-dm-flow
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: sales-conversation
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: offer
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: objections-map
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
actions:
- label: Подготовить диалог
  target: sales-conversation
  help: Поможет перейти от интереса к пониманию ситуации.
- label: Проверить оффер
  target: offer
  help: Поможет предложить следующий шаг без давления.
- label: Собрать карту заявок
  target: lead-content-map
  help: Поможет определить, какие сигналы считать лидовыми.
seo:
  title: Теплый лид
  description: Человек, который уже проявил интерес к теме, проблеме, материалу или действию. С ним важно продолжать диалог из его контекста, а не начинать продажу с нуля.
visibility: public
role: concept
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Человек, который уже проявил интерес к теме, проблеме, материалу или действию. С ним важно продолжать диалог из его контекста, а не начинать продажу с нуля.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Теплый лид

Человек, который уже проявил интерес к теме, проблеме, материалу или действию. С ним важно продолжать диалог из его контекста, а не начинать продажу с нуля.

В контентной системе это отвечает за связку между вниманием и обращением: человек должен узнать свою ситуацию, понять предложение и увидеть естественный переход к диалогу.
