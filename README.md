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
DATABASE_URL="postgresql://user:password@HOST:DBPORT/Name_of_bd"
**Dependencies installation**  
```bash
cd backend   
npm init
npm install
npx prisma generate
npx prisma migrate dev
```

---

### Frontend Setup
**Dependencies installation**

```bash
cd frontend
npm install
```

---

### Project launch:

```bash
npm run dev
```