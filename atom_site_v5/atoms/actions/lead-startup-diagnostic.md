---
id: lead-startup-diagnostic
title: Диагностика стартап-идеи
slug: lead-startup-diagnostic
kind: action
hub: products
summary: Разбор идеи продукта или сервиса, чтобы выбрать гипотезу, проверить спрос и собрать первый MVP.
status: public
links:
- id: startup-hypothesis
  rel: starts_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: demand-validation
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: mvp
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: traction-signal
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: product-scope
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
actions:
- label: Проверить идею
  target: lead-startup-diagnostic
  help: Собрать гипотезу, критерий спроса и первый MVP.
- label: Выбрать главный продукт
  target: lead-product-choice
  help: Если идей несколько, сначала выбрать одну для проверки.
seo:
  title: Диагностика стартап-идеи
  description: Разбор идеи продукта или сервиса, чтобы выбрать гипотезу, проверить спрос и собрать первый MVP.
visibility: public
role: lead_action
audience:
- founder
- entrepreneur
routes:
- chaos-to-focus
- idea-to-mvp
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: true
  show_in_nav: true
  max_outbound_links: 3
allowed_claims:
- Можно говорить, что диагностика помогает перейти от идеи к проверяемой гипотезе.
- Можно говорить, что MVP может быть техническим, ручным, no-code или консультационным.
- Можно говорить, что цель — получить первый сигнал до большой разработки.
forbidden_claims:
- Нельзя обещать успешный стартап или инвестиционную готовность.
- Нельзя сводить диагностику только к AI-проектам.
- Нельзя обещать гарантированный результат, продажи, ясность или успешный запуск.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать внутренние инструменты, платформы или технические детали в публичный следующий шаг для нетехнической аудитории.
- 'Нельзя добавлять ссылки на атомы с visibility: internal или can_surface: false.'
user_problem: Есть идея или несколько идей, но непонятно, что именно проверять первым и какую минимальную версию делать.
input:
- описание идеи
- предполагаемая аудитория
- текущие ресурсы и ограничения
- что уже пробовали или обсуждали
output:
- формулировка гипотезы
- первый тест спроса
- минимальный MVP или ручная проверка
---

# Диагностика идеи и первого MVP

Этот разбор подходит, когда есть идея продукта, сервиса или направления, но непонятно, что именно проверять первым. Хочется сразу собрать нормальную систему, но сначала нужно понять, есть ли задача, аудитория и сигнал спроса.

В работе идея переводится в гипотезу: кому это нужно, какую ситуацию решает, какой минимальный формат подойдет и какой сигнал покажет, что стоит продолжать. MVP может быть с AI, без AI, no-code, ручным, лендингом, консультацией или concierge-форматом.

Итог — не фантазия о будущем продукте, а первый проверяемый шаг: что предложить, кому, в каком виде и по какому критерию принимать следующее решение.
