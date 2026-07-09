---
id: situation-map
title: Карта ситуации
slug: situation-map
kind: artifact
hub: methods
summary: 'Практическая карта сложной ситуации: сущности, связи, повторения, ограничения и возможные точки действия.'
status: public
links:
- id: cognitive-reconstruction
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: knowledge-graph
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: repeating-scenarios
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: agency
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: lead-cognitive-reconstruction
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: situation-graph
  rel: visualized_as
  strength: 0.55
  visibility: public
  can_surface: false
- id: cognitive-gaps
  rel: shows
  strength: 0.55
  visibility: public
  can_surface: false
- id: action-point
  rel: shows
  strength: 0.55
  visibility: public
  can_surface: false
- id: map-first-approach
  rel: principle_of
  strength: 0.55
  visibility: public
  can_surface: false
actions:
- label: Разобрать ситуацию
  target: lead-cognitive-reconstruction
  help: Построить карту по описанию, заметкам или диалогу.
- label: Разобрать заметки
  target: lead-notes-analysis
  help: Использовать накопленный материал для карты.
seo:
  title: Карта ситуации
  description: 'Практическая карта сложной ситуации: сущности, связи, повторения, ограничения и возможные точки действия.'
visibility: public
role: support_context
audience:
- entrepreneur
- founder
- expert
routes:
- situation-to-map
surface_policy:
  can_be_main_topic: false
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- Можно говорить, что карта ситуации помогает увидеть структуру до составления плана.
- Можно говорить, что на карте могут быть люди, задачи, идеи, события, ограничения и решения.
- Можно говорить, что карта помогает выделить точки действия.
forbidden_claims:
- Нельзя утверждать, что карта сама решает проблему.
- Нельзя делать выводы о мотивах людей без данных.
- Нельзя обещать гарантированный результат, продажи, ясность или успешный запуск.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать внутренние инструменты, платформы или технические детали в публичный следующий шаг для нетехнической аудитории.
- 'Нельзя добавлять ссылки на атомы с visibility: internal или can_surface: false.'
user_problem: Ситуация описывается длинно и запутанно, но не видно структуры и ближайшего действия.
input:
- описание ситуации
- ключевые участники, события и решения
- повторения, ограничения и цели
output:
- карта сущностей и связей
- узкие места и пустоты
- точки действия
---

# Карта ситуации

Карта ситуации нужна там, где обычное описание уже не помогает. Когда рассказываешь “в двух словах”, а через двадцать минут в комнате появляются люди, проекты, старые решения, эмоции, долги, гипотезы и один загадочный Excel.

Карта раскладывает это на сущности и связи: что происходит, кто участвует, какие решения повторяются, где ограничения, где противоречия, где не хватает данных и какие действия вообще возможны.

Это не финальный план. Это слой перед планом. Сначала нужно увидеть местность, потом выбирать маршрут.
