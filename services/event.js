/**
 * services/event.js
 * Helper: อ่าน/เขียน current event จาก settings table
 */
const supabase = require('./supabase');

/** คืน event_id ของ event ที่ active อยู่ตอนนี้ */
async function getCurrentEventId() {
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'current_event_id')
    .maybeSingle();
  return (data && data.value) || 'default';
}

/** คืน event object { id, name, created_at } ของ event ปัจจุบัน */
async function getCurrentEvent() {
  const eventId = await getCurrentEventId();
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .maybeSingle();
  return data || { id: eventId, name: 'Default Event', created_at: null };
}

module.exports = { getCurrentEventId, getCurrentEvent };
