/**
 * data/seed.js
 * Mock data generator สำหรับทดสอบ NEXUS
 *
 * ใช้งาน:
 *   1. รัน server ก่อน:  node server.js
 *   2. รัน seed:          node data/seed.js
 *
 * จะสร้าง:
 *   - Check-in 10 คน
 *   - Poll 3 อัน (choice 1, rating 1, text 1)
 *   - Comment 8 ข้อพร้อมข้อมูล gender + rating
 */

const BASE = process.env.NEXUS_URL || 'http://localhost:3000';

const delay = ms => new Promise(r => setTimeout(r, ms));
const post  = async (path, body) => {
  const r = await fetch(`${BASE}${path}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  const json = await r.json();
  if (!r.ok) throw new Error(`POST ${path} → ${r.status}: ${JSON.stringify(json)}`);
  return json;
};

// ── Mock Data ──────────────────────────────────────────────────

const participants = [
  { name: 'ผศ.ดร.กุล',       gender: 'female' },
  { name: 'นายวันชัย สมใจ',   gender: 'male'   },
  { name: 'น.ส.อาราเล่',      gender: 'female' },
  { name: 'นายสมชาย ดีใจ',    gender: 'male'   },
  { name: 'น.ส.มานี รักเรียน', gender: 'female' },
  { name: 'นายประวิทย์',      gender: 'male'   },
  { name: 'น.ส.จันทร์เพ็ญ',   gender: 'female' },
  { name: 'นักศึกษาแถวหลัง',  gender: 'unspecified' },
  { name: 'อาจารย์ไม่บอกชื่อ', gender: 'nonbinary' },
  { name: 'Mr. Alex Johnson',  gender: 'male'   },
];

const commentTexts = [
  { text: 'เนื้อหาน่าสนใจมากครับ อยากให้มีงานแบบนี้บ่อยๆ', rating: 5, gender: 'male' },
  { text: 'สนุกค่ะ ได้ความรู้ใหม่ๆ เกี่ยวกับ AI และ IoT', rating: 4, gender: 'female' },
  { text: 'ห้องเย็นเกินไปนิดนึง แต่เนื้อหาดีมาก', rating: 3, gender: 'female' },
  { text: 'ไม่ค่อยได้ยินเสียงวิทยากรในบางช่วง อาจต้องปรับ mic', rating: 2, gender: 'male' },
  { text: 'วิทยากรเก่งมาก อธิบายได้ชัดเจน เข้าใจง่าย', rating: 5, gender: 'male' },
  { text: 'ขอ slide ได้ไหมคะ อยากนำไปทบทวน', rating: 4, gender: 'female' },
  { text: 'Great session! The IoT demo was impressive.', rating: 5, gender: 'male' },
  { text: 'ต้องการให้มี hands-on workshop ในครั้งต่อไป', rating: 4, gender: 'nonbinary' },
];

// ── Main ───────────────────────────────────────────────────────

async function seed() {
  console.log(`\n🌱 NEXUS Seed — connecting to ${BASE}\n`);

  // 1. Check-ins
  console.log('📋 Creating check-ins...');
  const sessions = [];
  for (const p of participants) {
    const sid  = `seed-${Math.random().toString(36).slice(2,10)}`;
    const res  = await post('/api/checkin', { name: p.name, sessionId: sid });
    sessions.push({ ...p, sessionId: sid });
    console.log(`   ✓ ${p.name} (${res.total} total)`);
    await delay(120);
  }

  // 2. Polls
  console.log('\n📊 Creating polls...');

  const poll1 = await post('/api/poll', {
    type: 'choice',
    question: 'คุณคิดว่า AI จะเปลี่ยนแปลงอาชีพของคุณอย่างไร?',
    options: ['เปลี่ยนแปลงมาก', 'เปลี่ยนบ้างแต่ยังทำได้', 'ไม่แน่ใจ', 'ไม่เปลี่ยนแปลง'],
  });
  console.log(`   ✓ Poll (choice): ${poll1.question}`);

  const poll2 = await post('/api/poll', {
    type: 'rating',
    question: 'คุณพึงพอใจกับงานวันนี้มากแค่ไหน?',
  });
  console.log(`   ✓ Poll (rating): ${poll2.question}`);

  const poll3 = await post('/api/poll', {
    type: 'text',
    question: 'คุณทำงานหรือเรียนอยู่ที่จังหวัดใด?',
  });
  console.log(`   ✓ Poll (text): ${poll3.question}`);

  // 3. Votes for poll1
  console.log('\n🗳️  Casting votes (choice poll)...');
  const opts = [0, 1, 0, 2, 1, 0, 3, 1, 0, 2];
  for (let i = 0; i < sessions.length; i++) {
    await post(`/api/poll/${poll1.id}/vote`, { sessionId: sessions[i].sessionId, optionIndex: opts[i] });
    await delay(80);
  }
  console.log('   ✓ 10 votes cast');

  // 4. Ratings for poll2
  console.log('\n⭐  Submitting ratings...');
  const ratings = [5, 4, 5, 3, 5, 4, 5, 4, 3, 5];
  for (let i = 0; i < sessions.length; i++) {
    await post(`/api/poll/${poll2.id}/rate`, { sessionId: sessions[i].sessionId, rating: ratings[i] });
    await delay(80);
  }
  console.log('   ✓ 10 ratings submitted');

  // 5. Text answers for poll3
  console.log('\n💬  Submitting text answers...');
  const provinces = ['กรุงเทพฯ','กรุงเทพฯ','เชียงใหม่','ขอนแก่น','กรุงเทพฯ','ชลบุรี','กรุงเทพฯ','นนทบุรี','กรุงเทพฯ','เชียงราย'];
  for (let i = 0; i < sessions.length; i++) {
    await post(`/api/poll/${poll3.id}/answer`, { sessionId: sessions[i].sessionId, answer: provinces[i] });
    await delay(80);
  }
  console.log('   ✓ 10 text answers submitted');

  // 6. Comments
  console.log('\n✍️  Posting comments...');
  for (const c of commentTexts) {
    const sid = `seed-cm-${Math.random().toString(36).slice(2,10)}`;
    const author = participants[Math.floor(Math.random() * participants.length)].name;
    await post('/api/comment', { text: c.text, author, gender: c.gender, rating: c.rating, sessionId: sid });
    console.log(`   ✓ "${c.text.slice(0, 40)}..."`);
    await delay(200);
  }

  // 7. Show results for all polls
  console.log('\n📢  Showing results...');
  for (const pollId of [poll1.id, poll2.id, poll3.id]) {
    await fetch(`${BASE}/api/poll/${pollId}/visibility`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showResults: true }),
    });
  }
  console.log('   ✓ All poll results visible');

  console.log('\n✅ Seed complete! เปิด http://localhost:3000/dashboard.html เพื่อดูผล\n');
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err.message);
  console.error('   ตรวจสอบว่า server กำลังรันอยู่ที่', BASE);
  process.exit(1);
});
