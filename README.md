# Кейсы — сайт-портфолио

Статический сайт-портфолио Антона Ложкина. Собирается [Notepub](https://github.com/cookiespooky/notepub)
из Markdown-файлов в `content/`, публикуется на GitHub Pages через GitHub Actions.

Публичный адрес: https://cookiespooky.github.io/cases/

## Структура

- `content/` — тексты страниц (frontmatter + Markdown)
  - `home.md` — главная (первый экран, направления, кейсы с фильтрами, процесс, стек)
  - `services.md`, `about.md`, `404.md`
  - `cases/*.md` — по одному файлу на кейс
- `theme/templates/` — HTML-шаблоны страниц и партиалы
- `theme/assets/` — CSS, JS, иконки и скриншоты (`shots/`)
- `config.yaml` — настройки сайта (адрес, заголовки, контакты)
- `config.dev.yaml` — то же для локального предпросмотра
- `rules.yaml` — типы страниц, маршруты, коллекции, поля frontmatter
- `scripts/build.sh` — сборка в `dist/`
- `.github/workflows/pages.yml` — сборка и деплой

## Локально

```bash
./scripts/build.sh                                             # собрать в dist/
./.bin/notepub serve --config ./config.dev.yaml --rules ./rules.yaml   # предпросмотр на 127.0.0.1:8080
```

Первый запуск `build.sh` сам поставит нужную версию Notepub в `.bin/` (нужен Go).

## Как добавить кейс

1. Создать `content/cases/<slug>.md`, взяв за образец любой существующий файл.
2. Заполнить frontmatter: `group` (sites | products | ai | research), `kicker`, `summary`,
   `status`, `facts`, `highlights`, `stack`, `links`, `nav_order`.
3. Скриншот положить в `theme/assets/shots/` и указать имя файла в поле `shot`.
   Если снимка нет — задать `cover: grid | rings | waves | dots | beam`, будет нарисованная обложка.
4. `git push` — сайт пересоберётся сам.

## Переезд на другой адрес

Адрес сайта задаётся в `config.yaml` (`site.base_url`, `site.media_base_url`, блок `runtime.prod`).
При переезде на `https://cookiespooky.github.io/` достаточно поменять эти значения;
маршруты кейсов (`/cases/<slug>/`) останутся прежними.
