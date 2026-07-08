---
type: article
id: "lead-ai-mvp-build"
title: "Собрать AI-MVP"
slug: "lead-ai-mvp-build"
kind: "action"
hub:
  - "products"
summary: "Лидовое действие для проектов, где нужно превратить идею, технический хаос или существующий репозиторий в первый AI-MVP, прототип, ТЗ или план разработки."
description: "Лидовое действие для проектов, где нужно превратить идею, технический хаос или существующий репозиторий в первый AI-MVP, прототип, ТЗ или план разработки."
status: "public"
lang: "ru"
links:
  - id: "ai-development"
    rel: "uses"
  - id: "vibe-coding"
    rel: "uses"
  - id: "codex"
    rel: "uses"
  - id: "technical-spec-from-idea"
    rel: "starts_with"
  - id: "ai-product-prototype"
    rel: "produces"
actions:
  - label: "Начать с идеи"
    target: "technical-spec-from-idea"
    help: "Поможет быстро описать продукт так, чтобы его можно было собирать."
  - label: "Подготовить контекст проекта"
    target: "context-package"
    help: "Поможет собрать файлы и правила для первого прохода модели."
---
# Собрать AI-MVP

Лидовое действие для проектов, где нужно превратить идею, технический хаос или существующий репозиторий в первый AI-MVP, прототип, ТЗ или план разработки.

Связанные элементы графа: [[ai-development|AI-разработка]], [[vibe-coding|Vibe coding]], [[codex|Codex]], [[technical-spec-from-idea|Техническое ТЗ из идеи]], [[ai-product-prototype|AI-прототип продукта]].

## Связи

- [[ai-development|AI-разработка]] — uses
- [[vibe-coding|Vibe coding]] — uses
- [[codex|Codex]] — uses
- [[technical-spec-from-idea|Техническое ТЗ из идеи]] — starts_with
- [[ai-product-prototype|AI-прототип продукта]] — produces

## Следующие действия

- **Начать с идеи** → [[technical-spec-from-idea|Техническое ТЗ из идеи]]: Поможет быстро описать продукт так, чтобы его можно было собирать.
- **Подготовить контекст проекта** → [[context-package|Пакет контекста]]: Поможет собрать файлы и правила для первого прохода модели.
