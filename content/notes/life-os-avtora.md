---
type: note
slug: life-os-avtora
title: "Life OS: система, которую я сделал для себя"
description: "Life OS — система для дел, которую я собрал для себя шагами гайда «Вайбкодинг с нуля»: сообщения, письма, документы, задачи и деньги в одном месте, о котором можно спросить словами. Что в ней есть, как она работает у меня и в компании, где читать дальше."
draft: false
noindex: false
nav_order: 7
topic: "Life OS"
published_at: "2026-11-11"
date_label: "11 ноября 2026"
kicker: "Life OS"
lead: "Life OS — вайбкод-вещь, которую я сделал для своих дел и которая выросла в продукт. Почти всё в ней собрано шагами гайда «Вайбкодинг с нуля», только их больше."
updated_at: "2026-11-15"
tags: ["Life OS", "Obsidian", "Claude Code"]
related: ["proxy-tunnel", "notepub"]
---

На эту систему я ссылаюсь в заметках о [[prodvizhenie-v-threads|Threads]], [[pozicionirovanie-s-modelyu|позиционировании]] и [[kontekst-v-life-os|созвонах]]. Здесь — что она такое, из чего собрана и где читать подробнее; продукт целиком описан на [сайте Life OS](https://lifeos.antonlozhkin.ru/).

Life OS — вайбкод-вещь, которую я сделал для своих дел и которая выросла в продукт.

## Что в Life OS: все дела в одном месте, о котором можно спросить

Сообщения, письма, документы, задачи, мысли и деньги связаны в одну систему, и о ней достаточно спросить обычными словами: «что у меня с этим человеком?», «что сегодня требует действия?», «что мы решали про цены?».

Записи — обычные файлы в папке Obsidian. С ними работает ИИ-агент Claude Code. Повторяющееся — сбор почты, сборка документов, подсчёт денег — запрограммировано и идёт без ИИ. Решения принимает человек: система предлагает и показывает, на чём основано предложение.

По частям, на сайте Life OS:

- [Сводка нового](https://lifeos.antonlozhkin.ru/chto-vnutri/news/) — всё, что пришло за день в Telegram и на почту
- [Страница человека](https://lifeos.antonlozhkin.ru/chto-vnutri/people/) — кто он и что с ним происходило, по датам
- [Задачи](https://lifeos.antonlozhkin.ru/chto-vnutri/tasks/) и [«Сегодня»](https://lifeos.antonlozhkin.ru/chto-vnutri/today/) — что требует действия
- [Документ по шаблону](https://lifeos.antonlozhkin.ru/chto-vnutri/documents/) — договор или счёт из записи и своего образца
- [Идея с доводами за и против](https://lifeos.antonlozhkin.ru/chto-vnutri/ideas/) — с датой и автором доводов
- [Сделки по стадиям](https://lifeos.antonlozhkin.ru/chto-vnutri/deals/) — для компании
- [Телефон](https://lifeos.antonlozhkin.ru/chto-vnutri/phone/) — тот же пульт с чатом

## Каждая часть появлялась, когда надоедало делать руками

Сначала это было моё хранилище Obsidian с Claude Code: я просил агента разобрать входящие, найти, что я обещал, собрать договор. Следующая часть появлялась, когда надоедало пересылать сообщения в заметки, искать письма, считать деньги. Осенью 2026 года код отделился от записей: ту же систему можно поставить другому человеку, а записи у каждого свои. Метод, на котором держатся записи, — в [гайде по Obsidian](https://antonlozhkin.ru/obsidian-guide/lifeos-method/).

Шаги — те же, что в [гайде «Вайбкодинг с нуля»](https://vibewiki.github.io/):

- агент, который читает и пишет записи, — [Как установить Claude Code](https://vibewiki.github.io/kak-ustanovit-claude-code/)
- Claude из России через свой сервер — [Proxy Tunnel](https://vibewiki.github.io/svoy-server-dlya-claude/)
- бот, который принимает пересланное из Telegram, — [Как создать бота](https://vibewiki.github.io/kak-sozdat-bota/) и [Чтобы бот работал всегда](https://vibewiki.github.io/chtoby-bot-rabotal-vsegda/)
- посты по расписанию — [Бот, который публикует в ваш канал](https://vibewiki.github.io/bot-dlya-kanala/)
- ключи отдельно от записей — [Ключи и расходы](https://vibewiki.github.io/klyuchi-i-rashody/)
- каждая правка с возможностью вернуть — [Сохранения](https://vibewiki.github.io/sohraneniya/)
- сайт из заметок — [Как выложить страницу](https://vibewiki.github.io/kak-vylozhit-stranicu/); этот сайт, сайт Life OS и гайд собраны одним движком, [Notepub](https://antonlozhkin.ru/cases/notepub/)

## У меня и в компании Life OS начинается с разных страниц

У меня она ведёт всё рабочее: людей, задачи, решения, идеи, деньги, посты. В первой установке у другого человека — небольшой компании — первыми страницами стали сделки по стадиям, «Сегодня», документы и деньги. Claude там работает через тот же сервер, что настраивает бесплатный [Proxy Tunnel](https://antonlozhkin.ru/cases/proxy-tunnel/): бесплатная программа стала частью платного внедрения. Что меняется в Life OS и видно снаружи, попадает в [ленту изменений](https://antonlozhkin.ru/timeline/).

## Что из этого можно взять

- **Базовое хранилище** — папки и правила, по которым агент понимает записи с первого разговора: [шаблон Life OS](https://antonlozhkin.ru/obsidian-guide/lifeos-templates/), открыт [на GitHub](https://github.com/cookiespooky/lifeos-template). Код Life OS тоже будет открыт.
- **Чтобы агент читал только нужное** — [[kak-agent-ne-chitaet-ves-proekt|Как агент перестаёт читать весь проект]], с замерами каждого приёма.
- **Работать с хранилищем через агента без покупки** — [Obsidian и ИИ-агент](https://antonlozhkin.ru/obsidian-guide/obsidian-ai-agent/).
- **Life OS под ваши процессы** — [lifeos.antonlozhkin.ru](https://lifeos.antonlozhkin.ru/).
