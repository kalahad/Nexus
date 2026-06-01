/**
 * services/sheets.js
 * Google Sheets read/write via googleapis (Service Account)
 * Auto-creates missing sheet tabs on first use.
 */
const { google } = require('googleapis');

let _sheets = null;
let _auth   = null;

function getAuth() {
  if (_auth) return _auth;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key   = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!email || !key) throw new Error('Google Sheets credentials not configured');
  _auth = new google.auth.JWT(email, null, key, [
    'https://www.googleapis.com/auth/spreadsheets',
  ]);
  return _auth;
}

function getSheets() {
  if (_sheets) return _sheets;
  _sheets = google.sheets({ version: 'v4', auth: getAuth() });
  return _sheets;
}

const SPREADSHEET_ID = () => {
  if (!process.env.GOOGLE_SHEET_ID) throw new Error('GOOGLE_SHEET_ID not set');
  return process.env.GOOGLE_SHEET_ID;
};

// Cache of known sheet names to avoid repeated API calls
const knownSheets = new Set();

/**
 * Ensure a tab exists; create it if missing.
 */
async function ensureSheet(sheetName) {
  if (knownSheets.has(sheetName)) return;

  const sheets = getSheets();
  const sid    = SPREADSHEET_ID();

  try {
    // Try a lightweight read to check existence
    await sheets.spreadsheets.values.get({
      spreadsheetId: sid,
      range: `${sheetName}!A1`,
    });
    knownSheets.add(sheetName);
  } catch (err) {
    const msg = (err.message || '').toLowerCase();
    // "unable to parse range" or "notfound" → tab missing
    if (msg.includes('unable to parse') || msg.includes('not found') || err.code === 400) {
      console.log(`[Sheets] Creating missing tab: ${sheetName}`);
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sid,
        requestBody: {
          requests: [{ addSheet: { properties: { title: sheetName } } }],
        },
      });
      // Add header row
      const headers = {
        Checkins: [['sessionId', 'name', 'timestamp']],
        Votes:    [['pollId', 'question', 'option', 'sessionId', 'timestamp']],
        Comments: [['id', 'author', 'gender', 'rating', 'text', 'sentiment', 'timestamp']],
        Answers:  [['pollId', 'question', 'answer', 'sessionId', 'timestamp']],
      };
      if (headers[sheetName]) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: sid,
          range: `${sheetName}!A1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: headers[sheetName] },
        });
      }
      knownSheets.add(sheetName);
    } else {
      throw err;
    }
  }
}

/**
 * Append a row to a named sheet tab (auto-creates tab if missing).
 */
async function appendRow(sheetName, values) {
  await ensureSheet(sheetName);
  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID(),
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [values] },
  });
}

/**
 * Read all rows from a named sheet tab.
 */
async function readRows(sheetName) {
  await ensureSheet(sheetName);
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: `${sheetName}!A:Z`,
  });
  return res.data.values || [];
}

/**
 * Clear data rows (keep header row 1).
 */
async function clearRows(sheetName) {
  await ensureSheet(sheetName);
  const sheets = getSheets();
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID(),
    range: `${sheetName}!A2:Z`,
  });
}

module.exports = { appendRow, readRows, clearRows, ensureSheet };
