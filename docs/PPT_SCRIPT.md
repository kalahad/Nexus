# NEXUS — Script การนำเสนอ PowerPoint
## "NEXUS: Unified Event Intelligence Platform"

**ผู้นำเสนอ:** ผศ.ดร.กุล
**ระยะเวลา:** 15–20 นาที
**กลุ่มผู้ฟัง:** คณะกรรมการ / นักศึกษา / ผู้บริหาร

---

## SLIDE 1 — Title Slide

**หัวข้อ:** NEXUS
**หัวข้อรอง:** Unified Event Intelligence Platform
**ผู้นำเสนอ:** ผศ.ดร.กุล — รองคณบดีฝ่ายวิชาการและวิจัย
**สังกัด:** คณะวิศวกรรมศาสตร์ มหาวิทยาลัยรามคำแหง

**[รูปที่ 1 — Hero Background]**
> ชื่อรูป: `slide01_hero_bg.png`
> รายละเอียด: ภาพ dark background (#07090f) มีแสง gradient สีฟ้า-ม่วง (cyan #00e5ff + violet #7c3aed) เป็น glow effect คล้าย nebula ตรงกลางมีโลโก้ NEXUS ขนาดใหญ่ font Syne สีขาว ด้านล่างเป็น subtle hexagonal grid pattern บ่งบอกความเป็นเทคโนโลยี

**Script:**
> "สวัสดีครับ/ค่ะ วันนี้ผมจะนำเสนอโปรเจกต์ชื่อ NEXUS ซึ่งย่อมาจาก 'Unified Event Intelligence Platform' หรือแปลง่ายๆ คือ 'ระบบอัจฉริยะสำหรับงานกิจกรรม' ที่รวมทุกอย่างไว้ในที่เดียว"

---

## SLIDE 2 — ปัญหาที่พบ (Problem Statement)

**หัวข้อ:** "งานดี... แต่ไม่รู้ว่าคนในห้องคิดอะไร"

**[รูปที่ 2 — Pain Point Illustration]**
> ชื่อรูป: `slide02_pain_points.png`
> รายละเอียด: ภาพ split screen 2 ฝั่ง — ฝั่งซ้าย: วิทยากรกำลังนำเสนอบนเวที มีคำถามลอยอยู่รอบๆ เช่น "เขาเข้าใจไหม?", "น่าเบื่อไหม?", "ควรหยุดพักหรือยัง?" ฝั่งขวา: ผู้ฟังในห้องแต่ละคนมีฟองคิด (thought bubble) ที่ต่างกัน บางคน 😴 บางคน 🤔 บางคน 🤩 สีโทน warm amber บ่งบอกความไม่แน่ใจ

**เนื้อหา (Bullet points):**
- ❌ ไม่รู้ว่าผู้เข้าร่วมเข้าใจเนื้อหาแค่ไหน
- ❌ Feedback form กระดาษ → ช้า, ข้อมูลไม่ real-time
- ❌ ผู้จัดงานปรับ content ระหว่างงานไม่ได้
- ❌ ไม่มีข้อมูลเชิงลึกหลังงานสำหรับการพัฒนา

**Script:**
> "ปัญหาที่ผู้จัดงาน สัมมนา หรืออาจารย์ในห้องเรียนทุกคนเจอคือ เราไม่รู้ว่าคนที่นั่งฟังอยู่นั้นรู้สึกอย่างไร เข้าใจไหม เบื่อไหม อยากถามอะไร การแจกกระดาษ feedback ท้ายงานนั้นช้าเกินไป และได้ข้อมูลที่ไม่ตรงเวลา"

---

## SLIDE 3 — Solution Overview

**หัวข้อ:** NEXUS คืออะไร?

**[รูปที่ 3 — System Overview Diagram]**
> ชื่อรูป: `slide03_system_overview.png`
> รายละเอียด: Diagram 3 column บน dark background — ซ้าย: ไอคอนมือถือ (Participant Page) กลาง: ไอคอน Server/Cloud (NEXUS Backend) ขวา: ไอคอน Projector Screen (Live Dashboard) มีลูกศร 2 ทิศทางเชื่อม 3 ส่วน พร้อม label "Socket.io Real-time" บนลูกศร ด้านล่าง column กลางมีไอคอน Google Sheets และ AI Brain

**เนื้อหา:**
- 📱 **Participant** — Check-in, Vote, Comment จากมือถือ
- 🖥️ **Live Dashboard** — ฉาย Projector, real-time charts
- ⚙️ **Admin Panel** — จัดการ Poll, AI Summary, Export
- 🤖 **AI Engine** — Sentiment + Summary 2 ภาษา
- 📊 **Google Sheets** — เก็บข้อมูลถาวร

**Script:**
> "NEXUS แก้ปัญหานี้โดยเชื่อมสามหน้าจอเข้าด้วยกันแบบ real-time ผู้เข้าร่วมใช้มือถือ scan QR แล้วตอบ Poll ให้ความเห็น Admin เห็นทุกอย่างบน Dashboard ทันที โดยไม่ต้อง refresh หน้า"

---

## SLIDE 4 — Key Features (1/2)

**หัวข้อ:** ฟีเจอร์หลัก — ด้านผู้เข้าร่วม

**[รูปที่ 4 — Participant Page Mockup]**
> ชื่อรูป: `slide04_participant_page.png`
> รายละเอียด: Smartphone mockup (iPhone frame) แสดงหน้า index.html — ส่วนบน: header NEXUS สีฟ้า ตรงกลาง: Poll card พร้อม 3 ตัวเลือกที่ผู้ใช้เลือกแล้ว 1 ตัวเป็นสีม่วง ด้านล่าง: Comment form มี pill buttons เพศ (ผู้ชาย/ผู้หญิง/ไม่ระบุ) และ 5 ดาว 3 ดาวสว่างสีทอง배경 dark #07090f พร้อม glassmorphism cards

**เนื้อหา:**
- ✅ QR Check-in → Badge ยืนยันทันที
- ✅ Poll 3 ประเภท: ตัวเลือก / คำตอบอิสระ / Rating ★
- ✅ เห็นผล Poll ทันทีเมื่อ Admin "แสดงผล"
- ✅ Comment Form: ชื่อ + เพศ + ดาว + ข้อความ
- ✅ Mobile-first, รองรับทุกหน้าจอ

**Script:**
> "ฝั่งผู้เข้าร่วม เขาแค่ scan QR ก็เข้าระบบได้ทันที ไม่ต้อง login ไม่ต้อง download app Poll มี 3 รูปแบบ ตั้งแต่การโหวตธรรมดา ไปจนถึงตอบอิสระซึ่งจะแสดงเป็น Word Cloud บน Projector และให้คะแนนดาว"

---

## SLIDE 5 — Key Features (2/2)

**หัวข้อ:** ฟีเจอร์หลัก — Live Dashboard & Admin

**[รูปที่ 5 — Dashboard Screenshot]**
> ชื่อรูป: `slide05_dashboard_view.png`
> รายละเอียด: Screenshot เต็มหน้าจอ dashboard.html บน dark background — บนสุด: stats row 5 card (check-in, votes, comments, positive%, engagement ring) กลาง: Word Cloud canvas แสดงจังหวัด เช่น "กรุงเทพฯ" ใหญ่ที่สุด "เชียงใหม่" รองลงมา ล่างขวา: Sentiment donut chart สีเขียว/น้ำเงิน/แดง บรรยากาศ projector dark theme สวยงาม

**เนื้อหา:**
- 📊 Stats: Check-ins, Votes, Comments, Sentiment%, Engagement Score
- ☁️ Word Cloud แบบ real-time canvas
- 📈 Sentiment + Gender + Rating Distribution Charts
- 💬 Live Comment Stream (ไหลขึ้นอัตโนมัติ)
- 🤖 AI Summary กล่อง (ไทย + English)

**[รูปที่ 6 — Admin Panel]**
> ชื่อรูป: `slide05b_admin_panel.png`
> รายละเอียด: Screenshot admin.html — แสดงหน้า Polls ซ้ายมือมี sidebar navigation สีเข้ม ตรงกลางมี Poll card ที่สร้างแล้ว 2 อัน แต่ละอันมีปุ่ม "แสดงผล" (สีฟ้า) และ "ปิด Poll" (ghost button) และ progress bars แสดงผลการโหวต มีตัวเลขผู้ตอบ real-time

**Script:**
> "บน Dashboard ที่ฉายบน Projector จะเห็นข้อมูลทุกอย่างแบบ real-time Engagement Score ที่คำนวณจากการมีส่วนร่วมจริง และ Word Cloud ที่วาดเองโดยไม่ต้องพึ่ง library ภายนอก"

---

## SLIDE 6 — AI Intelligence

**หัวข้อ:** ความฉลาดของ AI ใน NEXUS

**[รูปที่ 7 — AI Summary Output]**
> ชื่อรูป: `slide06_ai_summary.png`
> รายละเอียด: Card/box บน dark background แสดงผลลัพธ์ AI Summary — บนสุด: หัวข้อ "AI Event Summary" สีฟ้า ด้านล่าง: ย่อหน้าภาษาไทย 2-3 บรรทัด ตามด้วยภาษาอังกฤษ italic สีฟ้าอ่อน ถัดมา: Key Theme tags (chip) สีม่วงใส เช่น "IoT", "AI ในการเรียน", "ความพึงพอใจ" และ Key Theme สีฟ้าใส (English) ล่างสุด: ข้อเสนอแนะ 3 bullet points

**เนื้อหา:**
- **Sentiment Analysis** — วิเคราะห์ทุก comment ทันทีที่ส่ง
- **Bilingual Summary** — สรุปงานทั้งภาษาไทยและอังกฤษ
- **Key Themes** — ค้นหาประเด็นสำคัญอัตโนมัติ
- **Recommendations** — ข้อเสนอแนะสำหรับการพัฒนา
- **OpenRouter** — รองรับ AI หลายเจ้า (GPT, Claude, Gemini, Llama)

**Script:**
> "AI ใน NEXUS ทำงาน 2 ระดับ ระดับแรกคือวิเคราะห์ sentiment ทุก comment แบบ real-time ระดับที่สองคือเมื่อจบงาน Admin กดปุ่มเดียว ระบบจะสรุปภาพรวมทั้งหมดเป็น 2 ภาษา พร้อม Key Themes และข้อเสนอแนะ ที่สำคัญคือเลือก AI model ได้ตามงบประมาณ ตั้งแต่ฟรีจนถึง premium"

---

## SLIDE 7 — Tech Stack & Architecture

**หัวข้อ:** เทคโนโลยีที่ใช้

**[รูปที่ 8 — Tech Architecture Diagram]**
> ชื่อรูป: `slide07_architecture.png`
> รายละเอียด: Architecture diagram บน dark background — 3 tier: Frontend (3 HTML pages), Backend (Node.js+Express+Socket.io), External Services (OpenRouter AI + Google Sheets) เชื่อมด้วยลูกศรสีต่างๆ Frontend → Backend: HTTP REST + WebSocket สีฟ้า Backend → AI: HTTPS สีม่วง Backend → Sheets: HTTPS สีเขียว แต่ละ box มี icon และ label ชัดเจน โทน dark corporate

**เนื้อหา (2 column):**

**Backend:**
- Node.js v18+ + Express.js
- Socket.io (Real-time)
- Google Sheets API
- OpenAI / OpenRouter SDK

**Frontend:**
- Vanilla JS (ไม่พึ่ง framework)
- Chart.js 4.x (Charts)
- HTML5 Canvas (Word Cloud)
- Syne + Noto Sans Thai (Fonts)

**Script:**
> "ด้านเทคนิค เลือกใช้ Node.js กับ Socket.io เพราะเหมาะกับ real-time สุด Frontend เป็น Vanilla JS ล้วนๆ ไม่ใช้ framework ทำให้โหลดเร็วและง่ายต่อการ deploy สิ่งที่น่าสนใจคือ Word Cloud วาดด้วย HTML5 Canvas ล้วนๆ โดยไม่ต้องพึ่ง library"

---

## SLIDE 8 — Demo Flow

**หัวข้อ:** สาธิตการใช้งาน (Live Demo)

**[รูปที่ 9 — Demo Flow Diagram]**
> ชื่อรูป: `slide08_demo_flow.png`
> รายละเอียด: Numbered flow diagram แนวนอน 5 ขั้นตอน — 1) Admin เปิด /admin 2) Admin สร้าง Poll (icon wrench) 3) Participant Scan QR บนมือถือ (icon phone+qr) 4) Vote/Comment (icon hand tapping) 5) Dashboard แสดงผล real-time (icon monitor+chart) ลูกศรเชื่อมทุก step มีไอคอน Socket.io lightning bolt กลาง flow สีโทน cyan-violet gradient

**เนื้อหา:**
1. เปิด `/admin.html` → Login
2. สร้าง Poll 3 ประเภท
3. ผู้เข้าร่วม Scan QR → Check-in
4. เปิด Poll → รอผู้โหวต (Dashboard ขึ้น real-time)
5. กด "แสดงผล" → ทุกคนเห็น
6. Generate AI Summary → ส่งไป Dashboard

**Script:**
> "ขอสาธิตสด...  Admin สร้าง Poll ก่อน แล้วเปิด Dashboard บน Projector ผู้เข้าร่วม Scan QR เข้ามา เมื่อมีคนโหวต ตัวเลขบน Projector จะขยับทันที เมื่อพร้อม Admin กด 'แสดงผล' ทุกคนเห็น chart บนมือถือพร้อมกัน"

---

## SLIDE 9 — Data & Analytics

**หัวข้อ:** ข้อมูลที่ได้จาก NEXUS

**[รูปที่ 10 — Google Sheets Data View]**
> ชื่อรูป: `slide09_sheets_data.png`
> รายละเอียด: Screenshot Google Sheets แสดง 3 tab — Checkins (sessionId, name, timestamp), Votes (pollId, question, option, sessionId, timestamp), Comments (id, author, gender, rating, text, sentiment, timestamp) Header row สีเทาเข้ม ข้อมูลสีขาว highlight row comment ที่ sentiment=positive เป็นสีเขียวอ่อน ด้านซ้ายมีตัวเลข row count

**เนื้อหา:**
| ข้อมูลที่เก็บ | ใช้วิเคราะห์อะไร |
|---|---|
| Check-in + เวลา | Attendance timeline |
| Poll votes | Preference analysis |
| Comment + Sentiment | Satisfaction analysis |
| Gender + Rating | Demographic insights |
| AI Summary | Executive report |

**Script:**
> "ข้อมูลทุกอย่างจะถูกส่งไปเก็บใน Google Sheets อัตโนมัติ ซึ่งเปิดไว้สำหรับนำไปวิเคราะห์ต่อใน Excel, Python หรือ Looker Studio ได้ทันที พร้อมปุ่ม Export CSV ในระบบด้วย"

---

## SLIDE 10 — Engagement Score

**หัวข้อ:** Engagement Score — วัดการมีส่วนร่วมแบบ Quantitative

**[รูปที่ 11 — Engagement Ring Animation]**
> ชื่อรูป: `slide10_engagement_score.png`
> รายละเอียด: 3 ring charts ขนาดกลางเรียงกัน — ซ้าย: Score ต่ำ (25/100) สีแดง กลาง: Score ปานกลาง (60/100) สีเหลือง ขวา: Score สูง (85/100) สีเขียว ใต้แต่ละ ring มีคำอธิบาย เช่น "ผู้เข้าร่วมไม่ active" "มีส่วนร่วมพอสมควร" "Excellent engagement!" ด้านล่าง: สูตร formula Score = Vote Rate×35 + Comment Rate×35 + Positive%×30

**สูตร Engagement Score:**
```
Score = (Votes/Check-ins × 35)
      + (Comments/Check-ins × 35)
      + (Positive% × 30)
      = 0–100
```

**Script:**
> "สิ่งที่ต่างจากระบบทั่วไปคือ Engagement Score ตัวเลข 0-100 ที่คำนวณจากพฤติกรรมจริงของผู้เข้าร่วม ถ้า score สูงแปลว่างานนั้นคนมีส่วนร่วมมาก ถ้า score ต่ำ admin รู้ได้ทันทีว่าต้องปรับอะไร"

---

## SLIDE 11 — Future Roadmap

**หัวข้อ:** แผนพัฒนา v2.0

**[รูปที่ 12 — Roadmap Timeline]**
> ชื่อรูป: `slide11_roadmap.png`
> รายละเอียด: Horizontal timeline บน dark background — Q3 2569: v1.0 (จุดปัจจุบัน สีเขียว), Q4 2569: v1.5 Persistent DB + Multi-event (สีฟ้า), Q1 2570: v2.0 Analytics Dashboard + Mobile App (สีม่วง), Q2 2570: v2.5 Integration LMS (Moodle/Google Classroom) (สีเหลือง) แต่ละจุดมี icon และ feature list

**เนื้อหา:**

**v1.5 — Near Term:**
- 🗄️ SQLite / PostgreSQL (แทน in-memory)
- 🔐 JWT Authentication
- 📱 PWA (ติดตั้งบนมือถือได้)

**v2.0 — Mid Term:**
- 📊 Historical Analytics Dashboard
- 🎓 LMS Integration (Moodle, Google Classroom)
- 🌐 Multi-language Support

**Script:**
> "v1.0 นี้เป็น proof-of-concept ที่สมบูรณ์ แผนต่อไปคือเพิ่ม persistent database เพื่อให้ข้อมูลไม่หายเมื่อ restart และเชื่อมกับ LMS ของมหาวิทยาลัย เพื่อให้ใช้ในห้องเรียนจริงได้"

---

## SLIDE 12 — Conclusion

**หัวข้อ:** สรุป — NEXUS ทำให้ทุกงานสมาร์ทขึ้น

**[รูปที่ 13 — Summary Visual]**
> ชื่อรูป: `slide12_conclusion.png`
> รายละเอียด: Dark background พร้อม 3 icon ขนาดใหญ่เรียงกัน — ซ้าย: icon lightning bolt สีฟ้า + "Real-time" กลาง: icon brain สีม่วง + "AI-Powered" ขวา: icon chart สีเหลือง + "Data-Driven" ใต้ 3 icon มี tagline: "NEXUS — เพราะทุก Feedback มีความหมาย" สีขาว font Syne ขนาดใหญ่ ล่างสุดมี URL และ QR code ของ project

**เนื้อหา:**
- ⚡ **Real-time** — ทุก action สะท้อนบน Dashboard ทันที
- 🤖 **AI-Powered** — Sentiment + Summary อัตโนมัติ
- 📊 **Data-Driven** — ตัดสินใจจากข้อมูลจริง ไม่ใช่ความรู้สึก

**Call to Action:**
> "ลองใช้งาน: `node server.js` → `http://localhost:3000`"

**Script:**
> "NEXUS ถูกสร้างขึ้นเพื่อตอบโจทย์ว่า 'เราจะรู้ได้อย่างไรว่างานนั้นประสบความสำเร็จ?' คำตอบคือ วัดจากข้อมูลจริง real-time ขอบคุณครับ/ค่ะ มีคำถามอะไรไหมครับ?"

---

## SLIDE 13 — Q&A

**หัวข้อ:** Q&A

**[รูปที่ 14 — Q&A Slide]**
> ชื่อรูป: `slide13_qa.png`
> รายละเอียด: Minimal slide — dark background ตรงกลางมีคำว่า "Q&A" ขนาดใหญ่มาก font Syne gradient cyan-violet ด้านล่างเล็กน้อยมี "ยินดีตอบทุกคำถาม" สีเทา และ contact info email: kulwarun@gmail.com ด้านล่างสุดมี NEXUS logo เล็กๆ

---

## หมายเหตุการนำเสนอ

**เทคนิคแนะนำ:**
1. **Demo สด** — เตรียม terminal ไว้ รัน `node server.js` + `node data/seed.js` ก่อน present
2. **2 หน้าจอ** — Projector: `/dashboard.html` | ของตัวเอง: `/admin.html`
3. **ให้ผู้ฟัง Scan QR** — ให้คนในห้อง scan จริงระหว่าง demo จะน่าประทับใจมาก
4. **Backup screenshots** — ถ้า internet ขัดข้อง มีภาพประกอบสำรอง
5. **Font size Dashboard** — เปิด dashboard ใน full-screen (F11)

**เวลาแนะนำ:**
| Slide | เวลา |
|---|---|
| 1-3 (Intro + Problem + Solution) | 3 นาที |
| 4-6 (Features + AI) | 4 นาที |
| 7-8 (Tech + Demo) | 5 นาที |
| 9-10 (Data + Score) | 3 นาที |
| 11-12 (Roadmap + Conclusion) | 2 นาที |
| 13 (Q&A) | 3+ นาที |
