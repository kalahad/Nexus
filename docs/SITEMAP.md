# NEXUS — Sitemap & Information Architecture

**Version:** 1.0.0 | **วันที่:** มิถุนายน 2569

---

## 1. Site Structure Overview

```
http://localhost:3000/
│
├── /index.html          ← Participant Page (ผู้เข้าร่วม)
├── /dashboard.html      ← Live Dashboard (Projector)
└── /admin.html          ← Admin Panel (ผู้จัดงาน)

API Endpoints:
└── /api/
    ├── checkin          ← Check-in management
    ├── poll             ← Poll CRUD + voting
    ├── comment          ← Comment + analytics
    ├── ai/summary       ← AI generation
    ├── settings         ← AI provider config
    ├── engagement       ← Engagement score
    └── export/csv       ← Data export
```

---

## 2. Page Flow Diagram

```
[QR Code บนจอ Projector]
        │
        ▼ Scan
┌───────────────────────────────────┐
│      /index.html                  │
│      PARTICIPANT PAGE             │
│                                   │
│  Step 1: Check-in                 │
│    └─ ใส่ชื่อ/นามแฝง → ยืนยัน   │
│                                   │
│  Step 2: Poll (auto-receive)      │
│    ├─ Multiple Choice → โหวต     │
│    ├─ Rating ★ → ให้คะแนน       │
│    └─ Word Cloud → พิมพ์คำตอบ   │
│                                   │
│  Step 3: Comment Form             │
│    ├─ ชื่อ / นามแฝง              │
│    ├─ เพศ (pill buttons)          │
│    ├─ ระดับความพึงพอใจ ★         │
│    └─ ข้อความความคิดเห็น         │
│                                   │
│  [Real-time via Socket.io]        │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│      /dashboard.html              │
│      LIVE DASHBOARD               │
│      (ฉายบน Projector)           │
│                                   │
│  Header: Logo + Clock + Status   │
│                                   │
│  Stats Row:                       │
│    ├─ ผู้เข้าร่วม (check-ins)   │
│    ├─ โหวต/ตอบ (total votes)    │
│    ├─ ความคิดเห็น (comments)     │
│    ├─ Positive %                  │
│    └─ Engagement Score 0–100 ⭕  │
│                                   │
│  Tab 1: Poll & Word Cloud         │
│    ├─ Poll Results (bars/ring)    │
│    ├─ QR Code                     │
│    └─ Word Cloud (canvas)         │
│                                   │
│  Tab 2: ความคิดเห็น              │
│    ├─ Sentiment Donut Chart       │
│    ├─ Gender Donut Chart          │
│    ├─ Rating Distribution         │
│    ├─ AI Summary (Thai+EN)        │
│    └─ Live Comment Stream ↑       │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│      /admin.html                  │
│      ADMIN PANEL                  │
│      (Login: admin/admin1234)     │
│                                   │
│  Nav:                             │
│    ├─ Overview                    │
│    │    ├─ Event Stats            │
│    │    ├─ QR Code                │
│    │    └─ Export CSV Buttons     │
│    │                              │
│    ├─ Polls                       │
│    │    ├─ Create Poll            │
│    │    │    ├─ Multiple Choice   │
│    │    │    ├─ Word Cloud        │
│    │    │    └─ Rating ★         │
│    │    └─ Active Polls           │
│    │         ├─ [แสดงผล/ซ่อนผล] │
│    │         ├─ [เปิด/ปิด Poll]  │
│    │         └─ [ลบ]             │
│    │                              │
│    ├─ Comments                    │
│    │    ├─ Table (author/gender/  │
│    │    │         rating/text/    │
│    │    │         sentiment)      │
│    │    └─ Export CSV             │
│    │                              │
│    ├─ Check-ins                   │
│    │    ├─ Participant list       │
│    │    └─ Export CSV             │
│    │                              │
│    ├─ AI Summary                  │
│    │    ├─ Generate Button        │
│    │    └─ Result (Thai+EN)       │
│    │                              │
│    ├─ AI Settings                 │
│    │    ├─ Provider Toggle        │
│    │    │    ├─ OpenAI            │
│    │    │    └─ OpenRouter        │
│    │    ├─ API Key Input          │
│    │    ├─ Model Selector         │
│    │    └─ Test AI Button         │
│    │                              │
│    └─ Live Dashboard ↗            │
└───────────────────────────────────┘
```

---

## 3. API Sitemap

### /api/checkin
| Method | Path | Action |
|--------|------|--------|
| POST | `/api/checkin` | Check-in participant |
| GET | `/api/checkin` | List all check-ins |
| GET | `/api/checkin/qr` | Generate QR code |

### /api/poll
| Method | Path | Action |
|--------|------|--------|
| POST | `/api/poll` | Create poll (choice/text/rating) |
| GET | `/api/poll` | List all polls |
| GET | `/api/poll/:id` | Get single poll |
| POST | `/api/poll/:id/vote` | Vote (choice) |
| POST | `/api/poll/:id/answer` | Answer (text) |
| POST | `/api/poll/:id/rate` | Rate (1–5 stars) |
| GET | `/api/poll/:id/wordcloud` | Word frequency |
| PATCH | `/api/poll/:id/visibility` | Show/hide results |
| PATCH | `/api/poll/:id/active` | Open/close poll |
| DELETE | `/api/poll/:id` | Delete poll |

### /api/comment
| Method | Path | Action |
|--------|------|--------|
| POST | `/api/comment` | Submit comment |
| GET | `/api/comment` | List + analytics summary |
| DELETE | `/api/comment/:id` | Delete comment |

### /api/ai & /api/settings
| Method | Path | Action |
|--------|------|--------|
| POST | `/api/ai/summary` | Generate AI summary |
| GET | `/api/settings` | Get AI config |
| POST | `/api/settings` | Update AI config |
| GET | `/api/settings/models` | List models by provider |

### Utility
| Method | Path | Action |
|--------|------|--------|
| POST | `/api/admin/login` | Admin authentication |
| GET | `/api/engagement` | Engagement score 0–100 |
| GET | `/api/export/csv?type=comments` | Export CSV |
| GET | `/api/export/csv?type=checkins` | Export CSV |
| GET | `/api/export/csv?type=votes` | Export CSV |

---

## 4. Socket.io Events

### Server → Client (emit)
| Event | Payload | Trigger |
|-------|---------|---------|
| `checkin_update` | `{ total, latest }` | New check-in |
| `poll_update` | `{ id, options, totalVotes, ... }` | Vote / create / delete |
| `poll_visibility` | `{ pollId, showResults }` | Admin toggle |
| `comment_update` | `{ comment, total, sentimentSummary, genderSummary, ratingSummary }` | New comment |
| `ai_update` | `{ summary, summaryTh, summaryEn, keyThemes, ... }` | AI generation done |

---

## 5. Data Flow

```
Participant Action
      │
      ▼
POST /api/* (HTTP)
      │
      ▼
Route Handler
  ├─ Validate input
  ├─ Update in-memory store
  ├─ io.emit(event, data)  ──────► All connected clients
  └─ sheets.appendRow()   ──────► Google Sheets (async)
```

---

## 6. User Journey Map

### Participant Journey (Happy Path)
```
มาถึงงาน
  → เห็น QR Code บน Projector
  → Scan QR ด้วยมือถือ
  → เปิดหน้า index.html
  → ใส่ชื่อ → กด "เช็คอิน"  [2 วินาที]
  → เห็น Badge ยืนยัน
  → รอ Poll (หน้าจอ auto-update)
  → Admin เปิด Poll → เห็น Poll ทันที (Socket.io)
  → โหวต / ตอบ / ให้ดาว  [10 วินาที]
  → Admin กด "แสดงผล" → เห็นผลทันที
  → เลื่อนลงกรอก Comment Form  [1 นาที]
  → กด "ส่ง" → เห็น Sentiment badge
  ✓ จบ engagement
```

### Admin Journey
```
เปิด /admin.html
  → Login
  → สร้าง Poll ก่อนเริ่มงาน
  → ระหว่างงาน: เปิด Poll ทีละตัว
  → ดู Live Counter ระหว่าง Poll
  → กด "แสดงผล" เมื่อพร้อม
  → หลังงาน: Generate AI Summary
  → Export CSV สำหรับรายงาน
```
