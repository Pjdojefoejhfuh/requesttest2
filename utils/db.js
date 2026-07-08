const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');
const PANEL_FILE = path.join(DATA_DIR, 'panel.json');

function ensureFile(file, defaultValue) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(defaultValue, null, 2));
}

ensureFile(REQUESTS_FILE, []);
ensureFile(PANEL_FILE, {});

function readRequests() {
  return JSON.parse(fs.readFileSync(REQUESTS_FILE, 'utf8'));
}

function writeRequests(requests) {
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

module.exports = {
  getAll() {
    return readRequests();
  },

  getPending() {
    return readRequests().filter((r) => r.status === 'pending');
  },

  getById(id) {
    return readRequests().find((r) => r.id === id) || null;
  },

  getActiveClaimByUser(userId) {
    return readRequests().find((r) => r.status === 'claimed' && r.claimedBy === userId) || null;
  },

  create(data) {
    const requests = readRequests();
    const request = {
      id: generateId(),
      status: 'pending', // pending | claimed | submitted
      claimedBy: null,
      claimedAt: null,
      submission: null,
      createdAt: Date.now(),
      ...data,
    };
    requests.push(request);
    writeRequests(requests);
    return request;
  },

  update(id, patch) {
    const requests = readRequests();
    const index = requests.findIndex((r) => r.id === id);
    if (index === -1) return null;
    requests[index] = { ...requests[index], ...patch };
    writeRequests(requests);
    return requests[index];
  },

  // --- Panel (message du panneau persistant) ---
  getPanel() {
    return JSON.parse(fs.readFileSync(PANEL_FILE, 'utf8'));
  },

  setPanel(data) {
    fs.writeFileSync(PANEL_FILE, JSON.stringify(data, null, 2));
  },
};
