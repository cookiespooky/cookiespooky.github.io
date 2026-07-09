---
id: obsidian
title: Obsidian
slug: obsidian
kind: tool
hub: tools
summary: Локальная база заметок, удобная для дневника, связей, Markdown-архива и работы с графом знаний.
status: public
links:
- id: notepub
  rel: related_product
  strength: 0.55
  visibility: public
  can_surface: false
- id: knowledge-graph
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: atomic-notes
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: diary
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: self-tracking
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: lead-notes-analysis
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: daily-notes
  rel: supports
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: vault-migration
  rel: source_for
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: personal-knowledge-base
  rel: stores
  strength: 0.55
  visibility: public
  can_surface: false
- id: wikilinks
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: lead-notepub-setup
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: self-tracking-dashboard
  rel: compatible_with
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: state-log
  rel: contains
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: decision-log
  rel: contains
  strength: 0.55
  visibility: contextual
  can_surface: false
actions:
- label: Разобрать заметки
  target: lead-notes-analysis
  help: Использовать базу как материал для карты тем и связей.
- label: Собрать публикацию
  target: lead-notepub-setup
  help: Выбрать публичный слой и превратить его в сайт.
seo:
  title: Obsidian
  description: Локальная база заметок, удобная для дневника, связей, Markdown-архива и работы с графом знаний.
visibility: public
role: support_context
audience:
- expert
- founder
- researcher
routes:
- notes-to-system
surface_policy:
  can_be_main_topic: false
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- Можно говорить, что Obsidian удобен для локальных Markdown-заметок и связей.
- Можно говорить, что он может быть источником материала для карты или сайта.
- Можно говорить, что инструмент не заменяет метод отбора и структуры.
forbidden_claims:
- Нельзя делать Obsidian обязательным инструментом для всех сценариев.
- Нельзя утверждать, что сама установка инструмента создает систему мышления.
- Нельзя обещать гарантированный результат, продажи, ясность или успешный запуск.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать внутренние инструменты, платформы или технические детали в публичный следующий шаг для нетехнической аудитории.
- 'Нельзя добавлять ссылки на атомы с visibility: internal или can_surface: false.'
user_problem: Нужно хранить идеи и материалы не линейной лентой, а связанной базой, которую можно анализировать и публиковать.
input:
- заметки, дневник, идеи, проекты и материалы
- структура папок или тегов
- правила связей и публичности
output:
- связанная база знаний
- материал для анализа
- основа для публикации или карты
---

# Obsidian

Obsidian — удобный инструмент для тех, кто мыслит не лентой, а сетью. В нем можно хранить дневник, идеи, проекты, исследования, контент и связи между заметками в обычных Markdown-файлах.

Но сам Obsidian не делает мышление системным. Можно построить красивый граф, который будет выглядеть как космос, а по смыслу останется кладовкой. Польза появляется, когда есть правила: что фиксировать, как связывать, что пересматривать и что делать публичным.

В этой системе Obsidian может быть источником материала: из заметок можно собрать карту ситуации, базу атомов, публичный сайт или контекст для модели.
