---
id: mvp
title: MVP
slug: mvp
kind: method
hub: methods
summary: Минимальная версия продукта или проверки, которая дает сигнал спроса, пользы или работоспособности идеи.
status: public
links:
- id: hypothesis-testing
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: vibe-coding
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: saas
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: product-thinking
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: ai-product-prototype
  rel: example_of
  strength: 0.6
  visibility: contextual
  can_surface: false
- id: technical-spec-from-idea
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: product-scope
  rel: requires
  strength: 0.7
  visibility: public
  can_surface: true
- id: concierge-mvp
  rel: type
  strength: 0.55
  visibility: public
  can_surface: false
- id: no-code-mvp
  rel: type
  strength: 0.55
  visibility: public
  can_surface: false
- id: demand-validation
  rel: serves
  strength: 0.55
  visibility: public
  can_surface: false
actions:
- label: Проверить идею
  target: lead-startup-diagnostic
  help: Выбрать гипотезу, критерий и минимальный формат проверки.
- label: Сузить скоуп
  target: product-scope
  help: Оставить только то, что нужно для первого сигнала.
seo:
  title: MVP
  description: Минимальная версия продукта или проверки, которая дает сигнал спроса, пользы или работоспособности идеи.
visibility: public
role: method
audience:
- founder
- entrepreneur
routes:
- idea-to-mvp
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- Можно говорить, что MVP может быть с AI, без AI, no-code, ручным, лендингом, консультацией или concierge-форматом.
- Можно говорить, что MVP нужен для проверки гипотезы, а не для демонстрации всей будущей системы.
- Можно говорить, что хороший MVP связан с критерием успеха.
forbidden_claims:
- Нельзя сводить MVP только к технической разработке.
- Нельзя обещать, что MVP сразу станет продуктом для масштабирования.
- Нельзя обещать гарантированный результат, продажи, ясность или успешный запуск.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать внутренние инструменты, платформы или технические детали в публичный следующий шаг для нетехнической аудитории.
- 'Нельзя добавлять ссылки на атомы с visibility: internal или can_surface: false.'
user_problem: Хочется построить полноценный продукт, но сначала нужно понять, какая минимальная версия даст реальный сигнал.
input:
- гипотеза продукта
- пользовательская задача
- критерий успеха
- ресурсы и ограничения
output:
- минимальный скоуп
- формат проверки
- сигналы продолжать, изменить или остановить
---

# MVP

MVP — это не “урезанная версия мечты”, а минимальная проверка гипотезы. Его задача — дать сигнал: людям это нужно, задача реальна, решение понятно, формат работает или нет.

MVP не обязан быть приложением. Он может быть ручным процессом, консультацией, лендингом, формой, таблицей, no-code сборкой, прототипом, AI-инструментом или вообще разговором с оплатой. Важен не стек, а то, какой риск вы проверяете.

Хороший MVP отвечает на один вопрос и имеет критерий: какой сигнал покажет, что стоит продолжать, что нужно менять, а что пора перестать героически строить.
