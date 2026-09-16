# antonlozhkin.ru — личный сайт

Статический сайт Антона Ложкина: кейсы, услуги, блог и заметки. Собирается
[Notepub](https://github.com/cookiespooky/notepub) из Markdown-файлов в `content/`, публикуется на GitHub
Pages через GitHub Actions.

Публичный адрес: https://antonlozhkin.ru

## Структура

- `content/` — тексты страниц (frontmatter + Markdown)
  - `home.md` — главная: первый экран, направления, каталог кейсов с вкладками, процесс
  - `cases/*.md` — по одному файлу на кейс; карточка каталога собирается из frontmatter
  - `services/*.md` — лендинги услуг, `services.md` — их список
  - `blog/*.md` — статьи, `blog.md` — лента
  - `notes/*.md` — некоммерческие заметки, `notes.md` — их индекс
- `theme/templates/` — HTML-шаблоны страниц и партиалы
- `theme/assets/` — CSS, JS, шрифты и скриншоты (`shots/`)
- `static/` — файлы, которые копируются в корень сайта как есть (подтверждения владения для поисковиков)
- `seo/` — реестр поисковых кластеров, под который пишется блог
- `config.yaml` — настройки сайта (адрес, заголовки, контакты), `config.dev.yaml` — то же для предпросмотра
- `rules.yaml` — типы страниц, маршруты, коллекции, поля frontmatter
- `scripts/` — сборка и обслуживающие скрипты
- `.github/workflows/pages.yml` — сборка и деплой

## Локально

```bash
./scripts/build.sh                                                     # собрать в dist/
./.bin/notepub serve --config ./config.dev.yaml --rules ./rules.yaml   # предпросмотр на 127.0.0.1:8080
```

Первый запуск `build.sh` сам поставит нужную версию Notepub в `.bin/` (нужен Go). Шаблоны читаются один раз
при старте, так что правку в `theme/templates/` видно только после перезапуска `serve`.

Тестов нет: проверка — это `./scripts/build.sh` без ошибок. `validate` ловит frontmatter, маршруты и битые
ссылки, а незнакомое поле frontmatter — ошибка сборки, а не молчаливо потерянное значение.

## Как добавить кейс

1. Создать `content/cases/<slug>.md`, взяв за образец любой существующий файл.
2. Заполнить frontmatter: `group` (products | ai | components | research | lab | sites), `nav_order`,
   `kicker`, `summary`, `status`, `status_kind`, `facts`, `highlights`, `stack`, `links`.
3. Скриншот (webp) положить в `theme/assets/shots/` и указать имя файла в поле `shot`, затем прогнать
   `python3 scripts/shots.py` — он сделает миниатюру для каталога и картинку для соцсетей. Если снимка нет —
   задать `cover: grid | rings | waves | dots | beam`, будет нарисованная обложка.
4. `git push` — сайт пересоберётся и опубликуется сам.

## Деплой

Пуш в `main` публикует сайт: промежуточной ветки нет. Домен задаётся файлом `CNAME` в корне — `build.sh`
кладёт его в `dist/`, и без него GitHub Pages сбрасывает привязку.
