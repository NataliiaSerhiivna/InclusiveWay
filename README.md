# InclusiveWay

Розробка платформи для побудови інклюзивних маршрутів та каталогізації безбар’єрних локацій.

## Поточна інструкція налаштування середовища проекту.

**GIT clone:**

```bash
git clone https://github.com/NataliiaSerhiivna/InclusiveWay.git
```

---

### Backend Setup

**Backend Runtime:** node.js version >= 20.12.0  
**Packet manager:** npm  
**Environment variables**  
PORT=your_port  
Connection via Supabase connection pooler (pgbouncer)
DATABASE_URL="postgresql://username:password@host:pooler-port/database?pgbouncer=true"

Direct connection to Supabase database (e.g. for migrations)
DIRECT_URL="postgresql://username:password@host:direct-port/database?sslmode=require"

JWT_SECRET=your_jwt_secret

**Dependencies installation**

```bash
cd backend

npm install
npx prisma generate
npm start
```

---

### Frontend Setup

**Environment variables**  
VITE_GOOGLE_CLIENT_ID=your_google_client_id

**Dependencies installation**

```bash
cd frontend

npm install
npm run dev
```
