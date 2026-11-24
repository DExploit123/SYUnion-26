/**
 * Mock Email Service for Samuel & Yemisi Wedding
 * Generates and stores realistic, styled royal confirmation emails sent to guests.
 */

export interface MockEmailMessage {
  id: string;
  rsvpId: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  sentAt: string;
  status: 'sent' | 'delivered';
  attending: 'yes' | 'no';
  guestCount: number;
  htmlBody: string;
  textBody: string;
}

export function generateConfirmationEmail(params: {
  rsvpId: string;
  fullName: string;
  email: string;
  attending: 'yes' | 'no';
  guestCount: number;
  message?: string;
}): MockEmailMessage {
  const { rsvpId, fullName, email, attending, guestCount, message } = params;
  const sentAt = new Date().toISOString();
  const id = `email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const isAttending = attending === 'yes';
  const subject = isAttending
    ? `Celebration Confirmed: Samuel & Yemisi's Royal Wedding — Dec 12, 2026`
    : `Thank You for Your Blessings — Samuel & Yemisi Wedding`;

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #120826; color: #FBF9F5; margin: 0; padding: 20px; }
    .card { max-width: 600px; margin: 0 auto; background-color: #1B0A33; border: 1px solid #D4AF37; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #2B1154, #120826); padding: 32px 24px; text-align: center; border-bottom: 1px solid rgba(212,175,55,0.4); }
    .title { color: #F3E5AB; font-family: Georgia, serif; font-size: 26px; margin: 0; font-weight: normal; }
    .subtitle { color: #C8B6FF; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px; }
    .content { padding: 32px 24px; color: #FBF9F5; line-height: 1.6; }
    .greeting { font-size: 18px; color: #F3E5AB; margin-bottom: 16px; }
    .details-box { background: rgba(18,8,38,0.7); border: 1px solid rgba(200,182,255,0.25); border-radius: 12px; padding: 18px; margin: 24px 0; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; }
    .row:last-child { border-bottom: none; }
    .label { color: #C8B6FF; }
    .value { font-weight: bold; color: #FBF9F5; }
    .gold-value { color: #F3E5AB; font-weight: bold; }
    .itinerary { margin-top: 24px; }
    .itinerary-item { margin-bottom: 14px; padding-left: 12px; border-left: 2px solid #D4AF37; }
    .itinerary-title { font-weight: bold; color: #F3E5AB; }
    .itinerary-meta { font-size: 13px; color: #C8B6FF; }
    .footer { text-align: center; padding: 24px; background-color: #0E061E; font-size: 12px; color: rgba(251,249,245,0.6); border-top: 1px solid rgba(212,175,55,0.2); }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="font-size: 12px; letter-spacing: 3px; color: #D4AF37; margin-bottom: 6px;">HOLY MATRIMONY</div>
      <h1 class="title">Samuel Onasanya & Akinlolu Yemisi</h1>
      <div class="subtitle">Saturday, December 12, 2026 · Lagos, Nigeria</div>
    </div>
    <div class="content">
      <div class="greeting">Dearest ${fullName},</div>
      <p>
        ${
          isAttending
            ? `We have joyfully received your RSVP! We are deeply honored that you will celebrate this sacred covenant with us as we exchange our vows and begin our new journey together.`
            : `We have received your RSVP. While we will dearly miss your presence in person, your warm prayers, blessings, and well-wishes mean the world to both of us.`
        }
      </p>

      <div class="details-box">
        <div class="row">
          <span class="label">Confirmation Reference:</span>
          <span class="gold-value">${rsvpId}</span>
        </div>
        <div class="row">
          <span class="label">Guest Name:</span>
          <span class="value">${fullName}</span>
        </div>
        <div class="row">
          <span class="label">Attendance Status:</span>
          <span class="value">${isAttending ? 'Joyfully Attending' : 'Regretfully Declined'}</span>
        </div>
        ${
          isAttending
            ? `<div class="row">
                <span class="label">Number of Reserved Seats:</span>
                <span class="gold-value">${guestCount} ${guestCount === 1 ? 'Guest' : 'Guests'}</span>
              </div>`
            : ''
        }
        <div class="row">
          <span class="label">Timestamp:</span>
          <span class="value">${new Date(sentAt).toLocaleDateString()} at ${new Date(sentAt).toLocaleTimeString()}</span>
        </div>
      </div>

      ${
        isAttending
          ? `
      <div class="itinerary">
        <h3 style="color: #F3E5AB; margin-bottom: 12px; font-size: 16px;">Celebration Itinerary & Details:</h3>
        <div class="itinerary-item">
          <div class="itinerary-title">Traditional Engagement &amp; Church Holy Matrimony</div>
          <div class="itinerary-meta">9:00 AM Engagement · 12:00 PM Church Wedding (followed by refreshments &amp; dismissal) · MFM SW 24, Regional Headquarters, Ibafo, Ogun State</div>
        </div>
        <div class="itinerary-item">
          <div class="itinerary-title">Dress Code</div>
          <div class="itinerary-meta">White &amp; Blue (Traditional attire or elegant formal wear)</div>
        </div>
      </div>
      `
          : ''
      }

      ${
        message
          ? `<p style="font-style: italic; color: #C8B6FF; font-size: 13px; margin-top: 18px; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 8px;">
              “${message}”
            </p>`
          : ''
      }

      <p style="margin-top: 24px;">
        With all our heartfelt love and blessings,<br>
        <strong style="color: #F3E5AB;">Samuel & Yemisi</strong><br>
        <span style="font-size: 12px; color: #C8B6FF;">#ForeverSamuelYemisi · #SY2026</span>
      </p>
    </div>
    <div class="footer">
      This confirmation email was generated by the Samuel & Yemisi Wedding Guest Portal.<br>
      To modify your reservation, please visit the wedding portal anytime.
    </div>
  </div>
</body>
</html>
  `.trim();

  const textBody = `
SAMUEL ONASANYA & AKINLOLU YEMISI
Holy Matrimony — Saturday, December 12, 2026

Dearest ${fullName},

${
  isAttending
    ? `We have joyfully received your RSVP! We are deeply honored that you will celebrate this sacred covenant with us on December 12, 2026.`
    : `We have received your RSVP. While we will dearly miss your presence in person, your warm prayers and love mean the world to us.`
}

RSVP Confirmation Reference: ${rsvpId}
Attendance: ${isAttending ? 'Joyfully Attending' : 'Regretfully Declined'}
${isAttending ? `Party Size: ${guestCount} Guest(s)` : ''}

Itinerary:
- Traditional Engagement: 9:00 AM at MFM SW 24, Regional Headquarters, Ibafo, Ogun State
- Church Holy Matrimony: 12:00 PM at MFM SW 24, Regional Headquarters, Ibafo, Ogun State (followed by refreshments & dismissal)
- Dress Code: White & Blue (Traditional attire or elegant formal wear)

With all our love,
Samuel & Yemisi
#ForeverSamuelYemisi
  `.trim();

  return {
    id,
    rsvpId,
    recipientEmail: email,
    recipientName: fullName,
    subject,
    sentAt,
    status: 'delivered',
    attending,
    guestCount,
    htmlBody,
    textBody,
  };
}

// Client-side mock outbox persistence in localStorage
const OUTBOX_KEY = 'wedding_mock_emails';

export function saveEmailToOutbox(email: MockEmailMessage): void {
  try {
    const existing: MockEmailMessage[] = JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]');
    existing.unshift(email);
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(existing.slice(0, 50)));
  } catch (err) {
    console.warn('Failed to save to local mock email outbox:', err);
  }
}

export function getOutboxEmails(): MockEmailMessage[] {
  try {
    return JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]');
  } catch {
    return [];
  }
}
