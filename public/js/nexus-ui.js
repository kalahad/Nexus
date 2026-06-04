/**
 * nexus-ui.js  —  Shared Theme + i18n Engine
 * ใช้งานทุกหน้า:  <script src="/js/nexus-ui.js"></script>
 * วาง <script> นี้ก่อน </body>  หรือ defer
 *
 * Public API:  window.NX.toggleTheme()
 *              window.NX.toggleLang()
 *              window.NX.t(key)
 *              window.NX.applyLang()
 */
(function () {
  /* ─────────────────────────────────────────
     1.  i18n Strings
  ───────────────────────────────────────── */
  const I18N = {
    th: {
      /* ── shared header ── */
      lang_toggle:    'EN',
      slogan:         'Event Intelligence Platform',
      connecting:     'กำลังเชื่อมต่อ',
      connected:      'เชื่อมต่อแล้ว',
      disconnected:   'ขาดการเชื่อมต่อ',
      attendees:      'ผู้เข้าร่วม',
      attendees_unit: 'คน',

      /* ── index — check-in ── */
      sec_checkin:    'CHECK IN',
      btn_checkin:    'เช็คอินเพื่อเข้าร่วม',
      name_ph:        'ชื่อหรือนามแฝงของคุณ...',
      checkin_ok:     n => `✓ เช็คอินสำเร็จ — ยินดีต้อนรับ ${n}!`,

      /* ── index — poll ── */
      sec_poll:       'POLL',
      poll_wait:      'รอ Admin เปิด Poll...',
      tag_choice:     'ตัวเลือก',
      voters:         'คนโหวต',
      responders:     'คนตอบ',
      raters:         'คนให้คะแนน',
      voted_done:     '✓ โหวตแล้ว — ขอบคุณ!',
      answered_done:  '✓ ส่งคำตอบแล้ว — ขอบคุณ!',
      submit_text:    'ส่ง',
      text_ph:        'พิมพ์คำตอบ...',
      r1:'😞 ต้องปรับปรุง', r2:'😐 พอใช้ได้', r3:'🙂 โอเค', r4:'😊 ดีมาก', r5:'🤩 ยอดเยี่ยม!',

      /* ── index — comment ── */
      sec_comment:    'แชร์ความรู้สึกของคุณ',
      comment_sub:    'ใช้เวลาไม่ถึง 1 นาที ✨',
      comment_lock:   'เช็คอินก่อนเพื่อแสดงความคิดเห็น',
      lbl_name:       'ชื่อ / นามแฝง',
      lbl_gender:     'เพศ',
      lbl_optional:   '(ไม่บังคับ)',
      lbl_rating:     'ความพึงพอใจ',
      lbl_comment:    'ความคิดเห็น',
      comment_ph:     'บอกเราได้เลย... ไม่มีถูกหรือผิด',
      pill_male:      '👨 ชาย',
      pill_female:    '👩 หญิง',
      pill_nb:        '🌈 อื่น',
      pill_ns:        '🤫 ไม่ตอบ',
      btn_submit:     'ส่งความคิดเห็น',
      submitting:     'กำลังส่ง...',
      sent_ok:        n => `💚 ส่งเรียบร้อย — ขอบคุณ ${n}!`,
      err_name:       'กรุณากรอกชื่อก่อน',
      err_comment:    'กรุณากรอกความคิดเห็น',

      /* ── dashboard — header ── */
      dash_live:      'Live Dashboard',
      dash_projector: 'สำหรับฉาย Projector',

      /* ── dashboard — stats ── */
      stat_checkin:   'ผู้เข้าร่วม',
      stat_votes:     'โหวต / ตอบ',
      stat_all_poll:  'รวมทุก Poll',
      stat_comments:  'ความคิดเห็น',
      stat_positive:  'Positive',
      stat_sentiment: 'ความรู้สึก',
      stat_engage:    'Engagement',

      /* ── dashboard — tabs ── */
      tab_poll:       'Poll & Word Cloud',
      tab_comment:    'ความคิดเห็น',

      /* ── dashboard — poll tab ── */
      card_poll_results: 'ผลการโหวต',
      card_qr:           'Scan to Join',
      card_wordcloud:    'Word Cloud — คำตอบอิสระ',
      wc_empty:          'ยังไม่มีคำตอบ หรือยังไม่มี Poll ประเภทตอบอิสระ',
      no_poll:           'ยังไม่มี Poll',
      tag_wc:            'word cloud',

      /* ── dashboard — comment tab ── */
      kpi_pos:          'Positive',
      kpi_neu:          'Neutral',
      kpi_neg:          'Negative',
      kpi_avg:          'คะแนนเฉลี่ย ★',
      card_sentiment:   'Sentiment',
      card_gender:      'เพศ',
      card_rating_dist: 'การกระจายคะแนน ★',
      card_ai:          'AI Event Summary',
      ai_placeholder:   'กด "Generate Summary" ในหน้า Admin เพื่อสร้างสรุปอัตโนมัติ',
      card_stream:      'Live Comment Stream',
      stream_empty:     'ยังไม่มีความคิดเห็น',
      g_male:'👨', g_female:'👩', g_nb:'🌈', g_ns:'🤫',

      /* ── admin — nav ── */
      nav_overview:   'Overview',
      nav_polls:      'Polls',
      nav_comments:   'Comments',
      nav_checkins:   'Check-ins',
      nav_ai:         'AI Summary',
      nav_settings:   'AI Settings',
      nav_dashboard:  'Live Dashboard ↗',

      /* ── admin — overview ── */
      card_stats:     'Event Stats',
      lbl_checkins_stat: 'CHECK-INS',
      lbl_comments_stat: 'COMMENTS',
      lbl_polls_stat:    'POLLS',
      card_qr_admin:     'QR Code',
      participant_url:   'Participant URL:',
      card_export:       'Export Data',
      btn_export_comments: '📥 Comments CSV',
      btn_export_checkins: '📥 Check-ins CSV',
      btn_export_votes:    '📥 Votes CSV',

      /* ── admin — polls ── */
      card_create_poll: 'สร้าง Poll ใหม่',
      ptype_choice:     'Multiple Choice',
      ptype_text:       'Word Cloud (ตอบอิสระ)',
      ptype_rating:     'Rating ★',
      poll_q_ph:        'คำถาม เช่น คุณทำงานอยู่จังหวัดใด?',
      opt_ph1:          'ตัวเลือก 1',
      opt_ph2:          'ตัวเลือก 2',
      btn_add_opt:      '+ เพิ่มตัวเลือก',
      btn_create_poll:  'สร้าง Poll',
      card_active_polls:'Polls ทั้งหมด',
      no_polls:         'ยังไม่มี Poll',
      btn_show:         'แสดงผล',
      btn_hide:         'ซ่อนผล',
      btn_close_poll:   'ปิด Poll',
      btn_open_poll:    'เปิด Poll',
      btn_delete:       'ลบ',
      showing:          '📢 แสดงผลแล้ว',
      hidden:           '🔒 ซ่อนผล',
      poll_open:        'เปิดอยู่',
      poll_closed:      'ปิดแล้ว',
      responses:        'responses',
      hint_text:        'ผู้ใช้พิมพ์คำตอบอิสระ — ระบบแสดง Word Cloud อัตโนมัติ',
      hint_rating:      'ผู้ใช้เลือกคะแนน 1–5 ดาว — Dashboard แสดงค่าเฉลี่ยและการกระจาย',

      /* ── admin — comments ── */
      th_author:    'Author',
      th_gender:    'เพศ',
      th_rating:    '★',
      th_comment:   'Comment',
      th_sentiment: 'Sentiment',
      th_time:      'Time',
      no_comments:  'ยังไม่มีความคิดเห็น',

      /* ── admin — checkins ── */
      th_no:        '#',
      th_name:      'Name',
      th_session:   'Session ID',
      no_checkins:  'ยังไม่มีข้อมูล',

      /* ── admin — AI summary ── */
      card_ai_gen:     'Generate AI Summary',
      ai_gen_desc:     'ระบบจะรวบรวมความคิดเห็นทั้งหมดและส่ง AI วิเคราะห์ แล้ว broadcast ไปยัง Dashboard อัตโนมัติ',
      btn_generate:    'Generate Summary',
      ai_result_title: 'ผลลัพธ์',
      ai_no_comments:  'ยังไม่มีความคิดเห็น',
      ai_generating:   'กำลังวิเคราะห์...',
      ai_sent:         '✓ ส่งไปยัง Dashboard แล้ว',

      /* ── admin — settings ── */
      card_provider:   'AI Provider',
      prov_openai:     'OpenAI',
      prov_openrouter: 'OpenRouter',
      lbl_apikey:      'API Key',
      apikey_ph:       'sk-... หรือ sk-or-v1-...',
      btn_show_key:    'Show',
      lbl_model:       'Model',
      btn_save:        'บันทึก Settings',
      btn_test:        'ทดสอบ AI',
      saved_ok:        '✓ บันทึกสำเร็จ',
      key_set:         '✓ API Key ตั้งค่าแล้ว',
      card_guide:      'OpenRouter Guide',
      test_title:      'ผลทดสอบ',
      testing:         'กำลังทดสอบ...',
      test_ok:         '✓ ทดสอบสำเร็จ',
      hint_openai:     'ใช้ OpenAI API โดยตรง — GPT-4o, GPT-3.5 Turbo',
      hint_openrouter: 'รวม AI หลายเจ้าในคีย์เดียว (OpenAI, Anthropic, Google, Meta, Mistral)',

      /* ── admin — event management ── */
      nav_event:          'Event',
      card_current_event: 'Event ที่กำลังดำเนินอยู่',
      lbl_event_name:     'ชื่อ Event',
      lbl_event_created:  'เริ่มเมื่อ',
      event_note:         'ข้อมูล Check-in, Poll, Comment และ AI Summary จะแยกตาม Event — เปลี่ยน Event แล้วข้อมูลเก่าไม่หาย',
      card_new_event:     'เริ่ม Event ใหม่',
      new_event_desc:     'เมื่อสร้าง Event ใหม่ ระบบจะเปลี่ยน Context ทันที — ผู้เข้าร่วมจะเช็คอินได้ใหม่ Poll และ Comment จะเริ่มนับใหม่',
      btn_new_event:      'เริ่ม Event ใหม่',

      /* ── admin — login ── */
      login_sub:     'Admin Panel',
      login_pw_ph:   'รหัสผ่าน',
      btn_login:     'เข้าสู่ระบบ',
      login_wrong:   'รหัสผ่านไม่ถูกต้อง',
    },

    en: {
      /* ── shared header ── */
      lang_toggle:    'ไทย',
      slogan:         'Event Intelligence Platform',
      connecting:     'Connecting',
      connected:      'Connected',
      disconnected:   'Disconnected',
      attendees:      'Attendees',
      attendees_unit: '',

      /* ── index — check-in ── */
      sec_checkin:    'CHECK IN',
      btn_checkin:    'Check In to Join',
      name_ph:        'Your name or nickname...',
      checkin_ok:     n => `✓ Welcome, ${n}!`,

      /* ── index — poll ── */
      sec_poll:       'POLL',
      poll_wait:      'Waiting for Admin to open a Poll...',
      tag_choice:     'choice',
      voters:         'votes',
      responders:     'responses',
      raters:         'ratings',
      voted_done:     '✓ Voted — Thank you!',
      answered_done:  '✓ Submitted — Thank you!',
      submit_text:    'Submit',
      text_ph:        'Type your answer...',
      r1:'😞 Poor', r2:'😐 Fair', r3:'🙂 OK', r4:'😊 Good', r5:'🤩 Excellent!',

      /* ── index — comment ── */
      sec_comment:    'Share Your Thoughts',
      comment_sub:    'Takes less than 1 min ✨',
      comment_lock:   'Check in first to leave a comment',
      lbl_name:       'Name / Nickname',
      lbl_gender:     'Gender',
      lbl_optional:   '(optional)',
      lbl_rating:     'Satisfaction',
      lbl_comment:    'Comment',
      comment_ph:     "Tell us anything... no right or wrong answer",
      pill_male:      '👨 Male',
      pill_female:    '👩 Female',
      pill_nb:        '🌈 Other',
      pill_ns:        '🤫 Prefer not to say',
      btn_submit:     'Submit Comment',
      submitting:     'Submitting...',
      sent_ok:        n => `💚 Submitted — Thank you, ${n}!`,
      err_name:       'Please enter your name first',
      err_comment:    'Please enter a comment',

      /* ── dashboard — header ── */
      dash_live:      'Live Dashboard',
      dash_projector: 'Projector View',

      /* ── dashboard — stats ── */
      stat_checkin:   'Attendees',
      stat_votes:     'Votes / Answers',
      stat_all_poll:  'All Polls',
      stat_comments:  'Comments',
      stat_positive:  'Positive',
      stat_sentiment: 'Sentiment',
      stat_engage:    'Engagement',

      /* ── dashboard — tabs ── */
      tab_poll:       'Poll & Word Cloud',
      tab_comment:    'Comments',

      /* ── dashboard — poll tab ── */
      card_poll_results: 'Poll Results',
      card_qr:           'Scan to Join',
      card_wordcloud:    'Word Cloud — Open Answers',
      wc_empty:          'No answers yet, or no open-answer Poll exists',
      no_poll:           'No Polls yet',
      tag_wc:            'word cloud',

      /* ── dashboard — comment tab ── */
      kpi_pos:          'Positive',
      kpi_neu:          'Neutral',
      kpi_neg:          'Negative',
      kpi_avg:          'Avg. Rating ★',
      card_sentiment:   'Sentiment',
      card_gender:      'Gender',
      card_rating_dist: 'Rating Distribution ★',
      card_ai:          'AI Event Summary',
      ai_placeholder:   'Click "Generate Summary" in Admin to create an AI summary',
      card_stream:      'Live Comment Stream',
      stream_empty:     'No comments yet',
      g_male:'👨', g_female:'👩', g_nb:'🌈', g_ns:'🤫',

      /* ── admin — nav ── */
      nav_overview:   'Overview',
      nav_polls:      'Polls',
      nav_comments:   'Comments',
      nav_checkins:   'Check-ins',
      nav_ai:         'AI Summary',
      nav_settings:   'AI Settings',
      nav_dashboard:  'Live Dashboard ↗',

      /* ── admin — overview ── */
      card_stats:        'Event Stats',
      lbl_checkins_stat: 'CHECK-INS',
      lbl_comments_stat: 'COMMENTS',
      lbl_polls_stat:    'POLLS',
      card_qr_admin:     'QR Code',
      participant_url:   'Participant URL:',
      card_export:       'Export Data',
      btn_export_comments: '📥 Comments CSV',
      btn_export_checkins: '📥 Check-ins CSV',
      btn_export_votes:    '📥 Votes CSV',

      /* ── admin — polls ── */
      card_create_poll: 'Create New Poll',
      ptype_choice:     'Multiple Choice',
      ptype_text:       'Word Cloud (Open Answer)',
      ptype_rating:     'Rating ★',
      poll_q_ph:        'Question, e.g. Which province do you work in?',
      opt_ph1:          'Option 1',
      opt_ph2:          'Option 2',
      btn_add_opt:      '+ Add Option',
      btn_create_poll:  'Create Poll',
      card_active_polls:'All Polls',
      no_polls:         'No Polls yet',
      btn_show:         'Show Results',
      btn_hide:         'Hide Results',
      btn_close_poll:   'Close Poll',
      btn_open_poll:    'Open Poll',
      btn_delete:       'Delete',
      showing:          '📢 Results visible',
      hidden:           '🔒 Results hidden',
      poll_open:        'Open',
      poll_closed:      'Closed',
      responses:        'responses',
      hint_text:        'Participants type a free-text answer — Word Cloud updates automatically',
      hint_rating:      'Participants select 1–5 stars — Dashboard shows average and distribution',

      /* ── admin — comments ── */
      th_author:    'Author',
      th_gender:    'Gender',
      th_rating:    '★',
      th_comment:   'Comment',
      th_sentiment: 'Sentiment',
      th_time:      'Time',
      no_comments:  'No comments yet',

      /* ── admin — checkins ── */
      th_no:        '#',
      th_name:      'Name',
      th_session:   'Session ID',
      no_checkins:  'No data yet',

      /* ── admin — AI summary ── */
      card_ai_gen:     'Generate AI Summary',
      ai_gen_desc:     'Collects all comments and runs AI analysis, then broadcasts to the Dashboard automatically.',
      btn_generate:    'Generate Summary',
      ai_result_title: 'Result',
      ai_no_comments:  'No comments yet',
      ai_generating:   'Analyzing...',
      ai_sent:         '✓ Sent to Dashboard',

      /* ── admin — settings ── */
      card_provider:   'AI Provider',
      prov_openai:     'OpenAI',
      prov_openrouter: 'OpenRouter',
      lbl_apikey:      'API Key',
      apikey_ph:       'sk-... or sk-or-v1-...',
      btn_show_key:    'Show',
      lbl_model:       'Model',
      btn_save:        'Save Settings',
      btn_test:        'Test AI',
      saved_ok:        '✓ Saved',
      key_set:         '✓ API Key configured',
      card_guide:      'OpenRouter Guide',
      test_title:      'Test Result',
      testing:         'Testing...',
      test_ok:         '✓ Test passed',
      hint_openai:     'Direct OpenAI API — GPT-4o, GPT-3.5 Turbo',
      hint_openrouter: 'Multiple AI providers in one key (OpenAI, Anthropic, Google, Meta, Mistral)',

      /* ── admin — event management ── */
      nav_event:          'Event',
      card_current_event: 'Active Event',
      lbl_event_name:     'Event Name',
      lbl_event_created:  'Started',
      event_note:         'Check-ins, Polls, Comments and AI Summary are scoped per Event — switching events preserves all historical data.',
      card_new_event:     'Start New Event',
      new_event_desc:     'Creating a new event switches the active context immediately — attendees can check in again and Polls/Comments start fresh.',
      btn_new_event:      'Start New Event',

      /* ── admin — login ── */
      login_sub:     'Admin Panel',
      login_pw_ph:   'Password',
      btn_login:     'Log In',
      login_wrong:   'Incorrect password',
    },
  };

  /* ─────────────────────────────────────────
     2.  State
  ───────────────────────────────────────── */
  let lang  = localStorage.getItem('nx_lang')  || 'th';
  let theme = localStorage.getItem('nx_theme') || 'light';

  /* ─────────────────────────────────────────
     3.  Theme
  ───────────────────────────────────────── */
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('nx-theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('nx_theme', theme);
    applyTheme();
  }

  /* ─────────────────────────────────────────
     4.  i18n helpers
  ───────────────────────────────────────── */
  function t(key) {
    const v = I18N[lang]?.[key];
    return typeof v === 'string' ? v : (I18N['th']?.[key] || key);
  }
  function tf(key, ...args) {
    const fn = I18N[lang]?.[key] || I18N['th']?.[key];
    return typeof fn === 'function' ? fn(...args) : key;
  }

  /* ─────────────────────────────────────────
     5.  applyLang — updates all [data-i18n] elements
  ───────────────────────────────────────── */
  function applyLang() {
    document.documentElement.lang = lang === 'th' ? 'th' : 'en';

    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const val = I18N[lang]?.[key];
      if (typeof val === 'string') el.textContent = val;
    });

    // Placeholder
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.dataset.i18nPh;
      const val = I18N[lang]?.[key];
      if (typeof val === 'string') el.placeholder = val;
    });

    // Lang toggle button label
    const langBtn = document.getElementById('nx-lang-btn');
    if (langBtn) langBtn.textContent = t('lang_toggle');

    // Page-specific callback (each page can override)
    if (typeof window.onLangChange === 'function') window.onLangChange(lang);
  }

  function toggleLang() {
    lang = lang === 'th' ? 'en' : 'th';
    localStorage.setItem('nx_lang', lang);
    applyLang();
  }

  /* ─────────────────────────────────────────
     6.  Shared header injector (optional)
         Call NX.renderHeader(el) to inject
         theme+lang buttons into a container
  ───────────────────────────────────────── */
  function renderHeaderControls(container) {
    if (!container) return;
    container.innerHTML = `
      <button class="nx-icon-btn" id="nx-lang-btn" onclick="NX.toggleLang()" title="เปลี่ยนภาษา / Language">${t('lang_toggle')}</button>
      <button class="nx-icon-btn" onclick="NX.toggleTheme()" title="Toggle theme"><span id="nx-theme-icon">${theme==='dark'?'☀️':'🌙'}</span></button>
    `;
  }

  /* ─────────────────────────────────────────
     7.  Auto-init
  ───────────────────────────────────────── */
  // Apply theme immediately (before DOMContentLoaded to avoid flash)
  applyTheme();

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(); // re-apply after DOM ready (updates button icon)
    applyLang();
  });

  /* ─────────────────────────────────────────
     8.  Expose global
  ───────────────────────────────────────── */
  window.NX = { t, tf, toggleTheme, toggleLang, applyLang, applyTheme, renderHeaderControls,
    get lang()  { return lang;  },
    get theme() { return theme; },
  };

})();
