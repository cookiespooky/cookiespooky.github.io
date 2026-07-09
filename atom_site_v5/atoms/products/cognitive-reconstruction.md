---
id: cognitive-reconstruction
title: Когнитивная реконструкция
slug: cognitive-reconstruction
kind: method
hub: products
summary: Метод разбора сложной ситуации через карту сущностей, связей, повторяющихся сценариев и точек действия.
status: public
links:
- id: situation-map
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: lat
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
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
- id: obsidian
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: lead-cognitive-reconstruction
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: lead-notes-analysis
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: cognitive-gaps
  rel: detects
  strength: 0.55
  visibility: public
  can_surface: false
- id: lens-analysis
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: situation-graph
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: source-material
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: action-point
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: reconstruction-session
  rel: implemented_as
  strength: 0.55
  visibility: public
  can_surface: false
actions:
- label: Разобрать ситуацию
  target: lead-cognitive-reconstruction
  help: Подходит, когда сначала нужна карта, а уже потом план.
- label: Разобрать заметки
  target: lead-notes-analysis
  help: Подходит, если материал уже накоплен в дневнике, базе знаний или документах.
seo:
  title: Когнитивная реконструкция
  description: Метод разбора сложной ситуации через карту сущностей, связей, повторяющихся сценариев и точек действия.
visibility: public
role: offer
audience:
- entrepreneur
- founder
- expert
routes:
- situation-to-map
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: true
  show_in_nav: true
  max_outbound_links: 3
allowed_claims:
- Можно говорить, что метод помогает превратить сложную ситуацию в карту сущностей и связей.
- Можно говорить, что результатом может быть карта, список гипотез и ближайшие точки действия.
- Можно говорить, что метод работает с заметками, диалогом, дневником, контентом или списком проектов.
forbidden_claims:
- Нельзя называть метод терапией или заменой профессиональной помощи.
- Нельзя утверждать, что карта сама решает ситуацию без последующих действий.
- Нельзя обещать гарантированный результат, продажи, ясность или успешный запуск.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать внутренние инструменты, платформы или технические детали в публичный следующий шаг для нетехнической аудитории.
- 'Нельзя добавлять ссылки на атомы с visibility: internal или can_surface: false.'
user_problem: В ситуации слишком много идей, людей, решений, материалов или противоречий, и обычный план не помогает увидеть структуру.
input:
- заметки, диалог, дневник, список проектов или описание ситуации
- текущая цель или вопрос
- важные ограничения, участники и события
output:
- карта ситуации
- ключевые связи и повторяющиеся сценарии
- когнитивные пустоты и точки действия
---

# Когнитивная реконструкция

Когнитивная реконструкция нужна, когда ситуация стала слишком большой для головы: много идей, людей, решений, эмоций, материалов и повторяющихся сценариев. В таком состоянии план часто не помогает, потому что он пытается упорядочить то, что еще не разобрано.

Метод сначала раскладывает материал на сущности и связи: что происходит, кто участвует, какие решения повторяются, где есть противоречия, что уже известно, а где пустота. После этого появляется карта, на которой видно не только “что делать”, но и почему именно это действие сейчас важнее остальных.

Результат реконструкции — не мотивационный текст и не универсальный совет. Это рабочая карта ситуации, список гипотез и несколько точек действия, с которых можно начать движение без попытки удержать весь хаос в голове.
