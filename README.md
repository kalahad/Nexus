# NEXUS — Unified Event Intelligence Platform

ระบบ Real-time Event Engagement Platform สำหรับงานประชุม สัมมนา และกิจกรรมในห้องเรียน รองรับ QR Check-in, Live Poll 3 ประเภท, Comment พร้อม AI Sentiment Analysis และ Live Dashboard สำหรับฉายบน Projector

---

## Features

| Feature | รายละเอียด |
|---|---|
| QR Check-in | Scan QR → เช็คอินพร้อม badge ยืนยัน |
| Poll — Multiple Choice | โหวตตัวเลือก, กันโหวตซ้ำด้วย sessionId |
| Poll — Word Cloud | ตอบอิสระ → แสดง Word Cloud real-time |
| Poll — Rating ★ | ให้คะแนน 1–5 ดาว → average + distribution |
| Show/Hide Results | Admin เปิด-ปิดผล Poll → participant เห็นทันที |
| Comment Form | ชื่อ + เพศ + ดาว + ข้อความ + Auto-sentiment |
| AI Summary | สรุปงาน 2 ภาษา (ไทย-อังกฤษ) + Key Themes + ข้อเสนอแนะ |
| Live Dashboard | Engagement Score, Word Cloud, Comment Stream, Charts |
| Google Sheets Sync | บันทึกข้อมูลทุก event ลง Sheets อัตโนมัติ |
| Export CSV | ดาวน์โหลด Comments / Check-ins / Votes |

---

## การติดตั้ง (Installation)

### 1. Prerequisites

- Node.js v18 ขึ้นไป ([nodejs.org](https://nodejs.org))
- npm v9 ขึ้นไป

### 2. Clone / Download

```bash
cd "nexus-app"
```

### 3. ติดตั้ง dependencies

```bash
# ถ้ายังไม่มี node_modules หรือมีปัญหา ให้รันทั้งสองคำสั่ง
rmdir /s /q node_modules   # Windows CMD
del package-lock.json
npm install
```

---

## การตั้งค่า Environment (.env)

คัดลอกไฟล์ `.env.example` แล้วตั้งชื่อใหม่เป็น `.env`:

```bash
copy .env.example .env    # Windows
```

แก้ไขค่าใน `.env`:

```env
# ── AI Provider ──────────────────────────────────────────
# เลือก openai หรือ openrouter
AI_PROVIDER=openrouter

# OpenAI API Key: https://platform.openai.com/api-keys
# OpenRouter API Key: https://openrouter.ai/keys
OPENAI_API_KEY=sk-or-v1-...

# Model ที่ต้องการใช้
AI_MODEL=openai/gpt-4o-mini

# ── Google Sheets ─────────────────────────────────────────
# ID ของ Spreadsheet (จาก URL: .../spreadsheets/d/[ID]/edit)
GOOGLE_SHEET_ID=your_spreadsheet_id

# Service Account Email (จากไฟล์ JSON ที่ดาวน์โหลด)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@project.iam.gserviceaccount.com

# Private Key (วาง key ทั้งหมดพร้อม \n)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# ── App Config ────────────────────────────────────────────
PORT=3000
ADMIN_PASSWORD=admin1234
```

### Google Sheets Setup (ทีละขั้นตอน)

1. ไปที่ [console.cloud.google.com](https://console.cloud.google.com) → สร้างโปรเจกต์
2. APIs & Services → Enable APIs → ค้น **"Google Sheets API"** → Enable
3. Credentials → Create Credentials → **Service Account** → บันทึก
4. คลิก Service Account → Keys → Add Key → JSON → ดาวน์โหลด
5. สร้าง Google Sheet ใหม่ → Share → ใส่ email ของ Service Account (Editor)
6. คัดลอก Spreadsheet ID จาก URL มาใส่ `GOOGLE_SHEET_ID`
7. ระบบจะสร้าง Tab `Checkins`, `Votes`, `Comments`, `Answers` ให้อัตโนมัติ

---

## การรันระบบ

```bash
# Production
node server.js

# หรือผ่าน npm script
npm start

# Development (auto-restart เมื่อแก้ไขไฟล์)
npm run dev
```

เมื่อรันสำเร็จจะเห็น:
```
NEXUS running at http://localhost:3000
```

---

## URL แต่ละหน้า

| หน้า | URL | คำอธิบาย |
|---|---|---|
| Participant | `http://localhost:3000/` หรือ `/index.html` | หน้าสำหรับผู้เข้าร่วม: Check-in, Vote, Comment |
| Live Dashboard | `http://localhost:3000/dashboard.html` | หน้าฉาย Projector: real-time stats, word cloud, charts |
| Admin Panel | `http://localhost:3000/admin.html` | จัดการ Poll, ดู Comment, Generate AI Summary |

---

## Mock Data (ทดสอบ)

```bash
# สร้าง mock data: check-in 10 คน, poll 2 อัน, comment 5 ข้อ
node data/seed.js
```

หมายเหตุ: ต้องรัน server ก่อน (`node server.js`) แล้วจึงรัน seed ในอีก terminal

---

## โครงสร้างโปรเจกต์

```
nexus-app/
├── server.js              Main Express + Socket.io server
├── package.json
├── .env                   Environment variables (ไม่ commit)
├── .env.example           Template
├── README.md
├── routes/
│   ├── checkin.js         QR Check-in API
│   ├── poll.js            Poll CRUD (choice/text/rating)
│   └── comment.js         Comment API + analytics
├── services/
│   ├── ai.js              OpenAI/OpenRouter integration
│   └── sheets.js          Google Sheets read/write
├── data/
│   └── seed.js            Mock data generator
└── public/
    ├── index.html         Participant page
    ├── dashboard.html     Live dashboard (projector)
    └── admin.html         Admin panel
```

---

## API Endpoints

| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | `/api/checkin` | Check-in ผู้เข้าร่วม |
| GET | `/api/checkin/qr` | สร้าง QR Code |
| POST | `/api/poll` | สร้าง Poll |
| GET | `/api/poll` | List polls |
| POST | `/api/poll/:id/vote` | โหวต (choice) |
| POST | `/api/poll/:id/answer` | ตอบ (text) |
| POST | `/api/poll/:id/rate` | ให้คะแนน (rating) |
| PATCH | `/api/poll/:id/visibility` | แสดง/ซ่อนผล |
| PATCH | `/api/poll/:id/active` | เปิด/ปิด Poll |
| POST | `/api/comment` | ส่ง Comment |
| GET | `/api/comment` | List comments + analytics |
| POST | `/api/ai/summary` | Generate AI Summary |
| GET | `/api/export/csv?type=comments` | Export CSV |
| GET | `/api/settings` | ดู AI settings |
| POST | `/api/settings` | อัปเดต AI settings |
| GET | `/api/engagement` | Engagement score 0–100 |

---

## Tech Stack

- **Backend**: Node.js, Express.js, Socket.io
- **AI**: OpenAI API / OpenRouter (gpt-4o-mini, Claude, Gemini ฯลฯ)
- **Storage**: In-memory (runtime) + Google Sheets (persistent)
- **Frontend**: Vanilla JS, Chart.js, HTML5 Canvas (Word Cloud)
- **Fonts**: Syne + Noto Sans Thai (Google Fonts)

---

## License

MIT © 2025 NEXUS Project — คณะวิศวกรรมศาสตร์ มหาวิทยาลัยรามคำแหง
