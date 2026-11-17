/**
 * Express Backend Server with Vite Middleware
 * Handles RSVP submission persistence, guest list retrieval, and CSV export.
 */

import express from 'express';
import type { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RsvpRecord {
  id: string;
  fullName: string;
  contact: string;
  attending: 'yes' | 'no';
  guestCount: number;
  dietaryNotes?: string;
  message?: string;
  timestamp: string;
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const COUPLE_PASSCODE = process.env.COUPLE_PASSCODE || 'SY2026';

app.use(express.json());

// Persistent storage directory (defaults to project root; set DATA_DIR=/data when using a mounted volume)
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : __dirname;
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.error('Failed to ensure DATA_DIR:', err);
}

// RSVP storage initialized from disk store
const DATA_FILE = path.join(DATA_DIR, '.rsvp_store.json');
let rsvps: RsvpRecord[] = [];

try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    rsvps = JSON.parse(raw);
  }
} catch {
  rsvps = [];
}

const saveToDisk = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(rsvps, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write RSVP file:', err);
  }
};

// Sent emails store
const EMAIL_STORE_FILE = path.join(DATA_DIR, '.sent_emails.json');
interface SentEmailRecord {
  id: string;
  rsvpId: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  sentAt: string;
  status: 'sent' | 'delivered';
  attending: 'yes' | 'no';
  guestCount: number;
}
let sentEmails: SentEmailRecord[] = [];
try {
  if (fs.existsSync(EMAIL_STORE_FILE)) {
    sentEmails = JSON.parse(fs.readFileSync(EMAIL_STORE_FILE, 'utf-8'));
  }
} catch {
  sentEmails = [];
}
const saveEmailsToDisk = () => {
  try {
    fs.writeFileSync(EMAIL_STORE_FILE, JSON.stringify(sentEmails, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write emails file:', err);
  }
};

// Lightweight Health Check / Keep-Alive Ping Endpoint (for Render & Uptime Monitors)
app.get(['/api/health', '/healthz'], (_req: Request, res: Response) => {
  return res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// API: Submit RSVP with mock confirmation email dispatch
app.post('/api/rsvp', (req: Request, res: Response) => {
  try {
    const { fullName, email, contact, attending, guestCount, dietaryNotes, message, id, timestamp } = req.body;

    const recipientEmail = String(email || contact || '').trim();
    if (!fullName || !recipientEmail) {
      return res.status(400).json({ error: 'Full name and email address are required.' });
    }

    const rsvpId = id || `rsvp_${Date.now()}`;
    const newRecord: RsvpRecord = {
      id: rsvpId,
      fullName: String(fullName).trim(),
      contact: recipientEmail,
      attending: attending === 'no' ? 'no' : 'yes',
      guestCount: attending === 'no' ? 0 : Math.max(1, Number(guestCount) || 1),
      dietaryNotes: dietaryNotes ? String(dietaryNotes).trim() : '',
      message: message ? String(message).trim() : '',
      timestamp: timestamp || new Date().toISOString(),
    };

    rsvps.unshift(newRecord);
    saveToDisk();

    // Mock Email Service Dispatch
    const emailRecord: SentEmailRecord = {
      id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      rsvpId,
      recipientEmail,
      recipientName: newRecord.fullName,
      subject: newRecord.attending === 'yes'
        ? "Celebration Confirmed: Samuel & Yemisi's Royal Wedding — Dec 12, 2026"
        : 'Thank You for Your Blessings — Samuel & Yemisi Wedding',
      sentAt: new Date().toISOString(),
      status: 'delivered',
      attending: newRecord.attending,
      guestCount: newRecord.guestCount,
    };

    sentEmails.unshift(emailRecord);
    saveEmailsToDisk();

    console.log(`[MockEmailService] Royal confirmation email dispatched to: ${recipientEmail} (RSVP Ref: ${rsvpId})`);

    return res.status(201).json({
      success: true,
      message: 'RSVP successfully recorded and confirmation email sent.',
      data: newRecord,
      emailConfirmation: emailRecord,
    });
  } catch (error) {
    console.error('RSVP submission error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Resend confirmation email
app.post('/api/rsvp/resend-email', (req: Request, res: Response) => {
  try {
    const { rsvpId, email } = req.body;
    const rsvp = rsvps.find((r) => r.id === rsvpId || r.contact === email);

    if (!rsvp) {
      return res.status(404).json({ error: 'RSVP record not found.' });
    }

    const recipient = email || rsvp.contact;
    const resendRecord: SentEmailRecord = {
      id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      rsvpId: rsvp.id,
      recipientEmail: recipient,
      recipientName: rsvp.fullName,
      subject: `Resent: Celebration Confirmed — Samuel & Yemisi's Wedding`,
      sentAt: new Date().toISOString(),
      status: 'delivered',
      attending: rsvp.attending,
      guestCount: rsvp.guestCount,
    };

    sentEmails.unshift(resendRecord);
    saveEmailsToDisk();
    console.log(`[MockEmailService] Resent confirmation email to: ${recipient}`);

    return res.json({
      success: true,
      message: `Confirmation email resent to ${recipient}`,
      emailConfirmation: resendRecord,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to resend confirmation email.' });
  }
});

// Middleware to verify the couple's passcode for private guest response access
const getRequestPasscode = (req: Request): string => {
  const headerCode = req.headers['x-couple-passcode'];
  if (typeof headerCode === 'string') return headerCode.trim();
  const queryCode = req.query.passcode;
  if (typeof queryCode === 'string') return queryCode.trim();
  return '';
};

const requireCoupleAuth = (req: Request, res: Response, next: () => void) => {
  const provided = getRequestPasscode(req);
  if (!provided || provided !== COUPLE_PASSCODE) {
    return res.status(401).json({ error: 'Invalid or missing couple passcode.' });
  }
  return next();
};

// API: Verify Couple Portal passcode
app.post('/api/couple/auth', (req: Request, res: Response) => {
  const passcode = String(req.body?.passcode || '').trim();
  if (!passcode || passcode !== COUPLE_PASSCODE) {
    return res.status(401).json({ authenticated: false, error: 'Incorrect passcode. Please try again.' });
  }
  return res.json({ authenticated: true });
});

// API: List dispatched emails (protected for couple portal)
app.get('/api/emails', requireCoupleAuth, (_req: Request, res: Response) => {
  return res.json({
    totalSent: sentEmails.length,
    emails: sentEmails,
  });
});

// API: List RSVPs (protected for couple's private portal)
app.get('/api/rsvp', requireCoupleAuth, (_req: Request, res: Response) => {
  const attendingCount = rsvps
    .filter((r) => r.attending === 'yes')
    .reduce((sum, r) => sum + r.guestCount, 0);

  return res.json({
    totalSubmissions: rsvps.length,
    totalAttendingGuests: attendingCount,
    records: rsvps,
  });
});

// API: Delete an RSVP record (e.g. test submissions or duplicates)
app.delete('/api/rsvp/:id', requireCoupleAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = rsvps.length;
  rsvps = rsvps.filter((r) => r.id !== id);
  if (rsvps.length === initialLength) {
    return res.status(404).json({ error: 'RSVP record not found.' });
  }
  saveToDisk();
  sentEmails = sentEmails.filter((e) => e.rsvpId !== id);
  saveEmailsToDisk();
  return res.json({ success: true, id });
});

// API: Export CSV (protected for couple portal)
app.get('/api/rsvp/export-csv', requireCoupleAuth, (_req: Request, res: Response) => {
  const headers = ['ID', 'Full Name', 'Contact', 'Attending', 'Guests', 'Dietary Notes', 'Message', 'Date Submitted'];
  const rows = rsvps.map((r) => [
    `"${r.id}"`,
    `"${r.fullName.replace(/"/g, '""')}"`,
    `"${r.contact.replace(/"/g, '""')}"`,
    `"${r.attending}"`,
    `"${r.guestCount}"`,
    `"${(r.dietaryNotes || '').replace(/"/g, '""')}"`,
    `"${(r.message || '').replace(/"/g, '""')}"`,
    `"${r.timestamp}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="wedding_rsvps_oluwasegun_yemisi.csv"');
  return res.send(csvContent);
});

// Mount Vite middleware for development or serve built files
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProd) {
    if (process.env.DISABLE_HMR === 'true') {
      app.get('/@vite/client', (_req: Request, res: Response) => {
        res.type('application/javascript').send(`
const sheetsMap = new Map();
const linkSheetsMap = new Map();
if ("document" in globalThis) {
  document.querySelectorAll("style[data-vite-dev-id]").forEach((el) => {
    sheetsMap.set(el.getAttribute("data-vite-dev-id"), el);
  });
  document.querySelectorAll('link[rel="stylesheet"][data-vite-dev-id]').forEach((el) => {
    linkSheetsMap.set(el.getAttribute("data-vite-dev-id"), el);
  });
}
let lastInsertedStyle;
export function updateStyle(id, content) {
  if (linkSheetsMap.has(id)) return;
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("data-vite-dev-id", id);
    style.textContent = content;
    if (!lastInsertedStyle) {
      document.head.appendChild(style);
      setTimeout(() => { lastInsertedStyle = undefined; }, 0);
    } else {
      lastInsertedStyle.insertAdjacentElement("afterend", style);
    }
    lastInsertedStyle = style;
  } else if (style.textContent !== content) {
    style.textContent = content;
  }
  sheetsMap.set(id, style);
}
export function removeStyle(id) {
  if (linkSheetsMap.has(id)) {
    document.querySelectorAll(\`link[rel="stylesheet"][data-vite-dev-id="\${CSS.escape(id)}"]\`).forEach((el) => el.remove());
    linkSheetsMap.delete(id);
  }
  const style = sheetsMap.get(id);
  if (style) {
    document.head.removeChild(style);
    sheetsMap.delete(id);
  }
}
export function createHotContext() {
  return {
    data: {},
    accept() {},
    acceptExports() {},
    dispose() {},
    prune() {},
    decline() {},
    invalidate() {},
    on() {},
    off() {},
    send() {},
  };
}
export function injectQuery(url, queryToInject) {
  if (url[0] !== "." && url[0] !== "/") return url;
  const pathname = url.replace(/[?#].*$/, "");
  const { search, hash } = new URL(url, "http://vite.dev");
  return \`\${pathname}?\${queryToInject}\${search ? "&" + search.slice(1) : ""}\${hash || ""}\`;
}
export class ErrorOverlay extends HTMLElement {}
`);
      });
    }

    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        ws: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use('/assets', express.static(path.join(__dirname, 'dist/assets'), { maxAge: '7d' }));
    app.use('/public', express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));
    app.use(
      express.static(path.join(__dirname, 'dist'), {
        maxAge: '7d',
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          }
        },
      })
    );
    app.get('*', (_req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Wedding server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
