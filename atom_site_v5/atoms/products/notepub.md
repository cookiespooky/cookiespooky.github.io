---
id: notepub
title: Notepub
slug: notepub
kind: product
hub: products
summary: Подход и инструмент для превращения заметок, Markdown-базы или Obsidian-графа в публичный сайт и контекст для модели.
status: public
links:
- id: obsidian
  rel: compatible_with
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
- id: llm-site
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
- id: note-to-site-pipeline
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: public-vault
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: markdown-publishing
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: knowledge-garden
  rel: produces
  strength: 0.8
  visibility: contextual
  can_surface: false
- id: lead-notepub-setup
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Разобрать заметки
  target: lead-notes-analysis
  help: Найти темы, связи и публичные материалы в существующей базе.
- label: Собрать публикацию
  target: lead-notepub-setup
  help: Превратить выбранные заметки в структуру сайта.
seo:
  title: Notepub
  description: Подход и инструмент для превращения заметок, Markdown-базы или Obsidian-графа в публичный сайт и контекст для модели.
visibility: public
role: offer
audience:
- expert
- founder
- researcher
routes:
- notes-to-system
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: true
  show_in_nav: true
  max_outbound_links: 3
allowed_claims:
- Можно говорить, что Notepub превращает заметки в публичный слой сайта и структурированный контекст.
- Можно говорить, что подход работает с атомами смысла и связями.
- Можно говорить, что публикация должна быть понятна человеку и полезна модели.
forbidden_claims:
- Нельзя обещать SEO-результаты без стратегии, конкуренции и качества страниц.
- Нельзя публиковать личные материалы без отбора и приватных границ.
- Нельзя обещать гарантированный результат, продажи, ясность или успешный запуск.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать внутренние инструменты, платформы или технические детали в публичный следующий шаг для нетехнической аудитории.
- 'Нельзя добавлять ссылки на атомы с visibility: internal или can_surface: false.'
user_problem: Заметки, идеи и материалы накоплены, но лежат архивом и не превращаются в статьи, продукты, SEO-страницы или понятную систему.
input:
- Markdown-файлы, Obsidian-база, дневник или заметки
- темы, продукты и связи
- публичные и приватные границы
output:
- структура публикации
- страницы из атомов смысла
- контекст для модели и человекочитаемый сайт
---

# Notepub

Notepub нужен, когда заметки уже есть, но они работают как личный склад, а не как система. Внутри могут лежать идеи, наблюдения, тексты, продукты, исследования и полуготовые статьи, но без структуры они остаются архивом.

Подход строится вокруг атомов смысла: каждая заметка описывает одну сущность, а связи между заметками собирают карту. Из этой карты можно делать страницы сайта, маршруты для читателя, SEO-материалы и контекст для модели.

Главная задача — не просто “опубликовать Obsidian”. Задача — выбрать, какие смыслы можно сделать публичными, как связать их с продуктами и как превратить базу знаний в понятный путь для человека.
