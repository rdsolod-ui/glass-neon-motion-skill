# Установка Glass Neon Motion

Команды используют официальный [Skills CLI](https://github.com/vercel-labs/skills/blob/main/docs/commands.md). Нужны Node.js 22.20+ и доступ к GitHub. Выполняйте в терминале. Флаг `--global` делает скилл доступным для всех проектов; `--copy` копирует файлы вместо символьных ссылок. Для установки только в текущий проект уберите `--global`.

## Codex

```sh
npx skills add https://github.com/rdsolod-ui/glass-neon-motion-skill/tree/main/skill/glass-neon-motion --agent codex --global --copy
```

## Claude Code

```sh
npx skills add https://github.com/rdsolod-ui/glass-neon-motion-skill/tree/main/skill/glass-neon-motion --agent claude-code --global --copy
```

После установки откройте новый чат и попросите использовать `glass-neon-motion`. Установленные файлы не доказывают обнаружение скилла или обновление уже открытого чата. Скилл задаёт рабочие инструкции; установка не публикует сайты, не создаёт агентов и не настраивает MCP.

## Обновление

Повторите команду для нужного агента, предварительно сравнив и сохранив локальные правки и резервную копию установленного скилла. Не заменяйте пользовательские адаптации без проверки. Команды не содержат `--yes`: прочитайте подтверждения CLI перед заменой файлов.

## Проверка доступности без установки

```sh
npx skills add https://github.com/rdsolod-ui/glass-neon-motion-skill/tree/main/skill/glass-neon-motion --list
```

В списке должен быть `glass-neon-motion`. Это проверка discovery исходного пакета, не установка в агент.
