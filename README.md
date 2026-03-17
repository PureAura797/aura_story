# PureAura — Сайт клининговой компании

> Next.js 16 • Three.js (3D-сцена) • Tailwind CSS • Админ-панель • Мультиканальные уведомления

---

## 🚀 Быстрый старт (для разработчика / деплойщика)

```bash
# 1. Установить зависимости
npm install

# 2. Создать файл переменных окружения
cp .env.example .env.local

# 3. Отредактировать .env.local
#    (минимально: ADMIN_PASSWORD)

# 4. Запустить dev-сервер
npm run dev

# 5. Собрать production-билд
npm run build && npm start
```

---

## 📁 Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Админ-панель (8 страниц)
│   │   ├── analytics/      # Метрика, GA4, GTM, VK Pixel, скрипты
│   │   ├── calculator/     # Калькулятор стоимости
│   │   ├── contacts/       # Контактные данные компании
│   │   ├── content/        # Тексты сайта (~370 полей)
│   │   ├── login/          # Вход в админку
│   │   ├── media/          # Фото, видео, портфолио
│   │   ├── notifications/  # Email/Telegram/MAX/Webhook
│   │   ├── recovery/       # Восстановление пароля
│   │   ├── reviews/        # Отзывы клиентов
│   │   └── settings/       # Смена пароля
│   └── api/                # API-эндпоинты
│       ├── admin/          # Защищённые CRUD-операции
│       ├── contacts/       # Публичное чтение контактов
│       ├── content/        # Публичное чтение контента
│       └── submit-form/    # Приём заявок → уведомления
├── components/             # React-компоненты
│   ├── canvas/             # Three.js 3D-сцена
│   ├── sections/           # Секции главной страницы
│   ├── ui/                 # UI-элементы
│   └── AnalyticsScripts.tsx # Автоинъекция аналитики
├── data/                   # JSON-хранилище (вместо БД)
│   ├── analytics.json      # Настройки аналитики
│   ├── contacts.json       # Контактные данные
│   ├── content.json        # Тексты сайта
│   ├── notifications.json  # Настройки уведомлений
│   └── ...
└── lib/                    # Утилиты, i18n, auth
```

---

## ⚙️ Переменные окружения (.env.local)

| Переменная | Обязательная | Описание |
|-----------|:-----------:|----------|
| `ADMIN_PASSWORD` | ✅ | Пароль для входа в `/admin` |
| `RECOVERY_SMTP_HOST` | — | SMTP-сервер для сброса пароля |
| `RECOVERY_SMTP_PORT` | — | Порт SMTP (587) |
| `RECOVERY_SMTP_USER` | — | Логин SMTP |
| `RECOVERY_SMTP_PASS` | — | Пароль SMTP |
| `RECOVERY_EMAIL` | — | Email владельца для восстановления |

> Остальные настройки (аналитика, уведомления, контакты) управляются через админ-панель.

---

## 🔐 Админ-панель

**Вход:** `/admin/login` → вводите пароль из `ADMIN_PASSWORD`

| Раздел | Описание |
|--------|----------|
| **Контент** | Все тексты, заголовки, описания |
| **Калькулятор** | Цены, услуги, коэффициенты |
| **Отзывы** | Модерация отзывов |
| **Медиа** | Фото команды, портфолио, видео |
| **Контакты** | Телефон, email, мессенджеры |
| **Уведомления** | Каналы доставки заявок (Email/Telegram/MAX) |
| **Аналитика** | Счётчики, пиксели, произвольные скрипты |
| **Настройки** | Смена пароля |

---

## 📊 Для рекламщика

Зайдите в **Админка → Аналитика** и вставьте свои ID:

1. **Яндекс.Метрика** — Counter ID
2. **Google Analytics** — GA4 Measurement ID
3. **Google Tag Manager** — Container ID
4. **VK Pixel** — Pixel ID ретаргетинга
5. **Произвольные скрипты** — любой код (Roistat, Calltouch и т.д.)

Скрипты автоматически появятся на сайте после сохранения.

---

## 📬 Для настройки уведомлений

Зайдите в **Админка → Уведомления** и включите нужные каналы:

- **Email** — SMTP + адреса получателей
- **Telegram** — бот-токен + chat_id сотрудников
- **MAX** — бот-токен + chat_id
- **Webhook** — URL для n8n / Zapier

---

## 🗄️ Хранение данных

Сейчас данные хранятся в **JSON-файлах** (`src/data/`). Для продакшена рекомендуется миграция на базу данных:

- **Supabase** (PostgreSQL) — рекомендуется
- **MongoDB Atlas** — альтернатива
- **PlanetScale** — MySQL-вариант

При миграции нужно заменить `fs.readFileSync/writeFileSync` на запросы к БД в API-routes.

---

## 🌐 Деплой

### Vercel (рекомендуется)
```bash
npx vercel
```

### VPS / Dedicated
```bash
npm run build
PORT=3000 npm start
```

Рекомендуется использовать **PM2** или **Docker** для production:
```bash
pm2 start npm --name "pureaura" -- start
```

### Nginx (reverse proxy)
```nginx
server {
    server_name pureaura.ru;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
