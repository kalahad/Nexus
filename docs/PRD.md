# Product Requirements Document (PRD)
## NEXUS — Unified Event Intelligence Platform

**Version:** 1.0.0
**วันที่:** มิถุนายน 2569
**เจ้าของผลิตภัณฑ์:** ผศ.ดร.กุล — รองคณบดีฝ่ายวิชาการและวิจัย คณะวิศวกรรมศาสตร์ มหาวิทยาลัยรามคำแหง
**สถานะ:** Released v1.0

---

## 1. บทสรุปผู้บริหาร (Executive Summary)

NEXUS คือแพลตฟอร์ม Real-time Event Engagement ที่ออกแบบมาเพื่อยกระดับประสบการณ์การมีส่วนร่วมในงานประชุม สัมมนา และการเรียนการสอน โดยรวมฟีเจอร์ QR Check-in, Live Poll, AI-Powered Sentiment Analysis และ Live Dashboard ในระบบเดียว

**ปัญหาที่แก้ไข:**
ผู้จัดงานขาดข้อมูล real-time เกี่ยวกับความรู้สึกและการมีส่วนร่วมของผู้เข้าร่วม ทำให้ปรับการนำเสนอได้ยาก และไม่มีข้อมูลเชิงลึกหลังงาน

---

## 2. วัตถุประสงค์ (Objectives)

| # | วัตถุประสงค์ | ตัวชี้วัด |
|---|---|---|
| 1 | เพิ่มการมีส่วนร่วมของผู้เข้าร่วมงาน | Engagement Score ≥ 70/100 |
| 2 | เก็บข้อมูล Feedback แบบ real-time | Comment response rate ≥ 60% |
| 3 | ลดเวลาสรุปงานหลังกิจกรรม | AI สรุปได้ภายใน 30 วินาที |
| 4 | รองรับงานขนาด 10–500 คน | ทดสอบ load ≥ 500 concurrent users |

---

## 3. ผู้ใช้งาน (User Personas)

### 3.1 Admin / ผู้จัดงาน
- **บทบาท:** อาจารย์ วิทยากร ผู้ประสานงานงาน
- **ความต้องการ:** สร้าง Poll, ดูผลแบบ real-time, Generate AI Summary, Export ข้อมูล
- **ปัญหา:** ต้องการ feedback ทันทีระหว่างงาน

### 3.2 Participant / ผู้เข้าร่วม
- **บทบาท:** นักศึกษา ผู้ฟัง นักวิจัย
- **ความต้องการ:** Check-in ง่าย, ตอบ Poll บนมือถือ, แสดงความคิดเห็นโดยไม่เปิดเผยตัวตน
- **ปัญหา:** แบบฟอร์ม feedback ดั้งเดิมน่าเบื่อและไม่ interactive

### 3.3 Viewer / ผู้ชม Dashboard
- **บทบาท:** ผู้บริหาร คณะกรรมการ ผู้สังเกตการณ์
- **ความต้องการ:** ดู Live Dashboard บน Projector แบบอัตโนมัติ ไม่ต้อง interact
- **ปัญหา:** ไม่มีวิธีแสดงผลแบบ real-time ที่สวยงามบนหน้าจอขนาดใหญ่

---

## 4. Feature Requirements

### 4.1 Must Have (MVP)

| Feature | คำอธิบาย | Status |
|---|---|---|
| QR Check-in | สร้าง QR → Scan → บันทึกชื่อ + sessionId | ✅ Done |
| Poll — Multiple Choice | สร้างคำถาม + ตัวเลือก, กันโหวตซ้ำ | ✅ Done |
| Poll — Word Cloud | ตอบอิสระ → Word Cloud canvas real-time | ✅ Done |
| Poll — Rating ★ | ให้คะแนน 1–5 ดาว + distribution chart | ✅ Done |
| Comment Form | ชื่อ + เพศ + ดาว + ข้อความ | ✅ Done |
| AI Sentiment | วิเคราะห์ positive/neutral/negative อัตโนมัติ | ✅ Done |
| Live Dashboard | Dark theme, real-time via Socket.io | ✅ Done |
| Admin Panel | Login, manage polls, view data | ✅ Done |
| Google Sheets Sync | บันทึกข้อมูลถาวร | ✅ Done |

### 4.2 Should Have

| Feature | คำอธิบาย | Status |
|---|---|---|
| AI Summary (Thai+EN) | สรุป 2 ภาษา + Key Themes + ข้อเสนอแนะ | ✅ Done |
| Show/Hide Results | Admin เปิด-ปิดผล Poll ให้ participant เห็น | ✅ Done |
| Engagement Score | คะแนน 0–100 แบบ ring chart | ✅ Done |
| Export CSV | ดาวน์โหลด Comments, Check-ins, Votes | ✅ Done |
| Responsive Design | Mobile, tablet, desktop | ✅ Done |
| OpenRouter Support | รองรับ AI หลายเจ้า | ✅ Done |

### 4.3 Nice to Have (v2.0)

| Feature | คำอธิบาย | Priority |
|---|---|---|
| Authentication JWT | Token-based auth แทน session | Medium |
| Persistent Storage DB | PostgreSQL / SQLite แทน in-memory | High |
| Multi-event Support | จัดการหลายงานพร้อมกัน | High |
| Reaction Emojis | 👍❤️😮 real-time reactions | Low |
| Timer / Countdown | นับเวลาใน Poll | Medium |
| Analytics Dashboard | ประวัติข้อมูลย้อนหลัง | Medium |
| Push Notification | แจ้งเตือนเมื่อมี Poll ใหม่ | Low |

---

## 5. Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT LAYER                      │
│  index.html    dashboard.html    admin.html          │
│  (Participant)  (Projector)      (Admin)             │
└────────────────────┬────────────────────────────────┘
                     │ HTTP + WebSocket (Socket.io)
┌────────────────────▼────────────────────────────────┐
│                  SERVER LAYER                        │
│  Express.js + Socket.io (Node.js v18+)              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ /checkin │ │  /poll   │ │ /comment │            │
│  └──────────┘ └──────────┘ └──────────┘            │
│  ┌─────────────────────────────────────┐            │
│  │ services/ai.js  services/sheets.js  │            │
│  └─────────────────────────────────────┘            │
└──────────┬───────────────────┬─────────────────────┘
           │                   │
┌──────────▼──────┐   ┌────────▼──────────┐
│  OpenRouter API │   │  Google Sheets API │
│  (AI Analysis)  │   │  (Persistent Data) │
└─────────────────┘   └───────────────────┘
```

### Tech Stack
- **Runtime:** Node.js v18+
- **Framework:** Express.js 4.x
- **Real-time:** Socket.io 4.x
- **AI:** OpenAI API / OpenRouter
- **Storage:** In-memory (runtime) + Google Sheets (persistent)
- **Frontend:** Vanilla JS, Chart.js 4.x, HTML5 Canvas
- **Fonts:** Syne + Noto Sans Thai

---

## 6. Non-Functional Requirements

| ด้าน | ข้อกำหนด |
|---|---|
| Performance | Response time < 200ms สำหรับ API calls |
| Scalability | รองรับ 500 concurrent WebSocket connections |
| Availability | Uptime ≥ 99% ระหว่างงาน |
| Security | sessionId-based vote guard, admin password |
| Compatibility | Chrome, Safari, Firefox, Edge (2 versions ล่าสุด) |
| Mobile | iOS 14+, Android 10+, viewport 375px+ |

---

## 7. Data Model

### Comment
```json
{
  "id": "uuid",
  "author": "string",
  "gender": "male|female|nonbinary|unspecified",
  "rating": "1-5|null",
  "text": "string",
  "sentiment": "positive|neutral|negative",
  "sessionId": "string",
  "timestamp": "ISO8601"
}
```

### Poll
```json
{
  "id": "uuid",
  "question": "string",
  "type": "choice|text|rating",
  "options": [{ "text": "string", "votes": 0 }],
  "answers": ["string"],
  "ratingCounts": { "1":0, "2":0, "3":0, "4":0, "5":0 },
  "voters": "Set<sessionId>",
  "active": true,
  "showResults": false,
  "createdAt": "ISO8601"
}
```

---

## 8. Risks & Mitigations

| ความเสี่ยง | ผลกระทบ | มาตรการแก้ไข |
|---|---|---|
| Data loss เมื่อ restart server | สูง | Google Sheets sync + Export CSV |
| OpenRouter API down | กลาง | Fallback: sentiment = neutral, ไม่บล็อก comment |
| ผู้ใช้ใส่ข้อมูลซ้ำ | ต่ำ | sessionId guard ทุก endpoint |
| Google Sheets rate limit | ต่ำ | appendRow non-blocking, ไม่ affect UX |
| Browser ไม่รองรับ backdrop-filter | ต่ำ | Fallback background สีทึบ |

---

## 9. Success Metrics

- Engagement Score เฉลี่ย ≥ 65 ในงานจริง
- Comment response rate ≥ 50% ของ check-ins
- AI Summary accuracy: ผู้จัดงาน rate ≥ 4/5
- Setup time < 5 นาที (ตั้งแต่ `npm install` จนถึง `node server.js`)

---

## 10. Changelog

| Version | วันที่ | รายการเปลี่ยนแปลง |
|---|---|---|
| 1.0.0 | มิ.ย. 2569 | Initial release: Check-in, Poll 3 ประเภท, Comment, AI Summary, Dashboard, Admin |
