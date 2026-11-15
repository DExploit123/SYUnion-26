/**
 * Express Backend Server with Vite Middleware
 * Handles RSVP submission persistence, guest list retrieval, and CSV export.
 */

import express from 'express';
import type { Request, Response } from 'express';
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

app.use(express.json());

// In-memory RSVP storage initialized with demo seed or disk store
const DATA_FILE = path.join(__dirname, '.rsvp_store.json');
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

// In-memory mock sent emails store
const EMAIL_STORE_FILE = path.join(__dirname, '.sent_emails.json');
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

// API: List dispatched emails (for host dashboard)
app.get('/api/emails', (_req: Request, res: Response) => {
  return res.json({
    totalSent: sentEmails.length,
    emails: sentEmails,
  });
});

// API: List RSVPs (for couple's summary)
app.get('/api/rsvp', (_req: Request, res: Response) => {
  const attendingCount = rsvps
    .filter((r) => r.attending === 'yes')
    .reduce((sum, r) => sum + r.guestCount, 0);

  return res.json({
    totalSubmissions: rsvps.length,
    totalAttendingGuests: attendingCount,
    records: rsvps,
  });
});

// API: Export CSV
app.get('/api/rsvp/export-csv', (_req: Request, res: Response) => {
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
  res.setHeader('Content-Disposition', 'attachment; filename="wedding_rsvps_samuel_yemisi.csv"');
  return res.send(csvContent);
});

// Mount Vite middleware for development or serve built files
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use('/public', express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wedding server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
