---
id: atomic-notes
title: Атомарные заметки
slug: atomic-notes
kind: method
hub: methods
summary: 'Заметки, где каждая единица описывает один смысл: проблему, метод, принцип, продукт, кейс или действие.'
status: public
links:
- id: knowledge-graph
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: obsidian
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: llm-site
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: seo
  rel: related_to
  strength: 0.5
  visibility: internal
  can_surface: false
- id: llm-readable-notes
  rel: extends_to
  strength: 0.55
  visibility: public
  can_surface: false
- id: note-to-site-pipeline
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: vault-migration
  rel: produced_by
  strength: 0.55
  visibility: contextual
  can_surface: false
actions:
- label: Разобрать заметки
  target: lead-notes-analysis
  help: Выделить атомы смысла из существующего материала.
- label: Собрать публикацию
  target: lead-notepub-setup
  help: Использовать атомы как основу страниц и маршрутов.
seo:
  title: Атомарные заметки
  description: 'Заметки, где каждая единица описывает один смысл: проблему, метод, принцип, продукт, кейс или действие.'
visibility: public
role: method
audience:
- expert
- founder
- researcher
routes:
- notes-to-system
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- Можно говорить, что атомарная заметка описывает одну смысловую единицу.
- Можно говорить, что атомы могут быть проблемами, методами, продуктами, принципами, кейсами или действиями.
- Можно говорить, что атомизация помогает модели меньше смешивать контексты.
forbidden_claims:
- Нельзя утверждать, что любая короткая заметка автоматически является хорошим атомом.
- Нельзя дробить материал до бессмысленных обрывков без связей.
- Нельзя обещать гарантированный результат, продажи, ясность или успешный запуск.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать внутренние инструменты, платформы или технические детали в публичный следующий шаг для нетехнической аудитории.
- 'Нельзя добавлять ссылки на атомы с visibility: internal или can_surface: false.'
user_problem: Материалы смешаны в длинных текстах, поэтому модель и человек не понимают, какие смыслы отдельные, а какие связаны.
input:
- сырой текст, заметки или идеи
- границы одного смысла
- связи с другими сущностями
output:
- отдельные атомы смысла
- понятные связи
- материал для статей, графа и модели
---

# Атомарные заметки

Атомарная заметка описывает один смысл: проблему, метод, принцип, продукт, кейс, наблюдение или действие. Не “все мысли про маркетинг”, а одна сущность, которую можно понять, связать и использовать отдельно.

Для человека это снижает перегруз: вместо бесконечного полотна появляются ясные узлы. Для модели это еще важнее: она получает не кашу из абзацев, а структуру, где видно, какой смысл можно использовать и с чем он связан.

Хороший атом не обязан быть длинным. Он должен быть самостоятельным, точным и связанным с другими атомами. Тогда из него можно собирать статьи, маршруты, карты и подсказки без лишнего выдумывания.
