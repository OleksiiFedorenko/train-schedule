# Train Schedule

Простий застосунок-розклад на **Next.js (App Router, TypeScript)** з **авторизацією (NextAuth Credentials)**. Після логіну можна:
- **додавати** потяги;
- **редагувати** їх **цілком** (через модалку) або **точково** «на льоту» у таблиці (інлайн-редагування з комітом на blur/Enter);
- **видаляти** записи (через confirm-модалку).

UI у стилі «табло»: темна тема, зелений «glow», тости у правому верхньому куті.

---

## 🚀 Запуск проекту

### 1. **Клонування репозиторію**
```bash
git clone https://github.com/OleksiiFedorenko/trains-api.git
cd trains-api
```

### 2. Створення .env.local файлу за шаблоном нижче
```bash
# Бекенд (ПОВНИЙ HTTPS + /api в кінці), вже розгорнутий на Render.com, замінювати не потрібно
BACKEND_API_URL=https://trains-api-pj10.onrender.com/api/

# Фронтенд (Next.js) базовий URL (без /api в кінці)
NEXT_PUBLIC_API_BASE_URL=/backapi

# NextAuth секрет (будь-який довгий випадковий рядок (32+ символи))
NEXTAUTH_SECRET=replace-with-a-long-random-string

# NextAuth URL (адреса фронтенду)
NEXTAUTH_URL=http://localhost:3000
```
Файл .env.local має бути розташований у корені проекту (там же, де package.json).

### 3. Встановлення залежностей
```bash
# рекомендую використовувати yarn
yarn install

# альтернативно можна npm
npm install
```
### 4. Запуск проекту
```bash
# якщо використовуєш yarn
yarn dev

# або npm
npm run dev
```
Сервіс буде доступний на:
http://localhost:3000

## 🔌 API Ендпоінти
Бекенд має наступні REST-ендпоінти
```bash
POST /api/auth/register
POST /api/auth/login
GET /api/train
POST /api/train
PUT /api/train/:id
PATCH /api/train/:id
DELETE /api/train/:id
```
Усі вони використовуються у фронтенді, тож можна погратися з запитами там.

Enjoy! 😊