---
id: knowledge-graph
title: Граф знаний
slug: knowledge-graph
kind: tool
hub: tools
summary: Карта связанных смыслов, где видно, как темы, продукты, методы, кейсы и действия соединены между собой.
status: public
links:
- id: atomic-notes
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
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
- id: situation-map
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: lead-notes-analysis
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: bidirectional-links
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: graph-hygiene
  rel: requires
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: knowledge-garden
  rel: published_as
  strength: 0.55
  visibility: contextual
  can_surface: false
actions:
- label: Разобрать заметки
  target: lead-notes-analysis
  help: Собрать исходные атомы и связи из материалов.
- label: Собрать публикацию
  target: lead-notepub-setup
  help: Сделать из графа понятный сайт и маршруты.
seo:
  title: Граф знаний
  description: Карта связанных смыслов, где видно, как темы, продукты, методы, кейсы и действия соединены между собой.
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
- Можно говорить, что граф знаний показывает связи между атомами смысла.
- Можно говорить, что граф помогает навигации, генерации и поиску маршрутов.
- Можно говорить, что связи должны быть отобраны, иначе граф становится шумом.
forbidden_claims:
- Нельзя считать граф ценным только из-за количества узлов и связей.
- Нельзя показывать весь граф пользователю как основной интерфейс без маршрутов.
- Нельзя обещать гарантированный результат, продажи, ясность или успешный запуск.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать внутренние инструменты, платформы или технические детали в публичный следующий шаг для нетехнической аудитории.
- 'Нельзя добавлять ссылки на атомы с visibility: internal или can_surface: false.'
user_problem: Знания и материалы есть, но связи между ними не видны, поэтому сложно выбрать маршрут, статью, продукт или следующий шаг.
input:
- атомы смысла
- типы связей
- маршруты пользователя
- правила публичности
output:
- карта знаний
- навигация по связям
- контекст для генерации статей и маршрутов
---

# Граф знаний

Граф знаний — это карта связанных смыслов. В нем видно, как темы, продукты, методы, кейсы, принципы и действия соединены между собой.

Но граф ради графа быстро превращается в красивую паутину, на которую приятно смотреть и невозможно купить хлеб. Польза появляется, когда у связей есть роль: объяснить понятие, показать следующий шаг, поддержать статью, связать продукт с проблемой или скрыть технический контекст от пользователя.

Для сайта граф нужен не как музей всех атомов, а как внутренняя система маршрутов. Человек видит понятный путь, а модель получает структурированный контекст для генерации без лишнего прыжка в соседние смыслы.
