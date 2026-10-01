import { RSVPRecord } from '../types/rsvp';
import { getOfficialCardUrl } from '../lib/invitationCardAsset';

export interface EmailCustomization {
  subject?: string;
  message?: string;
  includeCardImage?: boolean;
  includeVenueDetails?: boolean;
}

export interface GeneratedEmail {
  subject: string;
  html: string;
  text: string;
}

/**
 * Generate luxury responsive HTML email for wedding guests
 */
export function generateWeddingEmail(
  type: 'acknowledgment' | 'approval' | 'waitlist',
  guest: RSVPRecord,
  customization?: EmailCustomization
): GeneratedEmail {
  const cardUrl = getOfficialCardUrl();
  const seats = guest.allocated_seats || guest.guest_count || 1;
  const hasPlusOne = seats > 1;
  const tableAssignment = guest.table_assignment || 'VIP Protocol Table';

  if (type === 'acknowledgment') {
    const subject =
      customization?.subject ||
      `RSVP Received: Precious & Ugochukwu Wedding (#UgoAmaka26) [Ref: ${guest.reference_code}]`;

    const customMsg =
      customization?.message ||
      `Thank you for honoring our upcoming union with your RSVP response. Because our wedding banquet is curated for an intimate gathering of strictly 100 guests, all responses are currently undergoing protocol review.`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #F4EBD9; font-family: 'Georgia', serif; color: #0E1B2E;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FAF5EA; border: 2px solid #D6B477; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08);">
    <!-- Gold Top Bar -->
    <tr>
      <td height="6" style="background: linear-gradient(90deg, #D6B477, #ECC880, #D6B477);"></td>
    </tr>
    <!-- Monogram Header -->
    <tr>
      <td align="center" style="padding: 35px 20px 20px 20px;">
        <div style="font-family: 'Times New Roman', serif; font-size: 32px; font-weight: bold; color: #0E1B2E; letter-spacing: 2px;">
          P &amp; U
        </div>
        <div style="font-size: 11px; letter-spacing: 3px; color: #D6B477; text-transform: uppercase; margin-top: 6px; font-weight: bold;">
          #UgoAmaka26 · 13 November 2026
        </div>
      </td>
    </tr>
    <!-- Main Content -->
    <tr>
      <td style="padding: 0 40px 30px 40px; text-align: center;">
        <h2 style="font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: #0E1B2E; margin-bottom: 8px;">
          RSVP Received
        </h2>
        <div style="display: inline-block; padding: 4px 14px; background-color: #0E1B2E; color: #ECC880; border-radius: 20px; font-size: 11px; font-family: monospace; font-weight: bold; margin-bottom: 20px;">
          Ref Code: ${guest.reference_code}
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #0E1B2E; margin-bottom: 16px;">
          Dear <strong>${guest.full_name}</strong>,
        </p>

        <p style="font-size: 14px; line-height: 1.7; color: #333333; margin-bottom: 24px;">
          ${customMsg}
        </p>

        <!-- Under Review Callout -->
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFFFF; border: 1px solid #D6B477; border-radius: 12px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 18px; text-align: left;">
              <div style="font-size: 12px; font-weight: bold; color: #8A6D3B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                ⏳ Protocol Seating Review
              </div>
              <div style="font-size: 13px; color: #4A4A4A; line-height: 1.5;">
                To safeguard our celebration's security and intimate seating, the official venue address and your personalized <strong>Official Invitation Card</strong> will be dispatched to this email address upon protocol clearance.
              </div>
            </td>
          </tr>
        </table>

        <p style="font-size: 13px; color: #666666; line-height: 1.6; margin-bottom: 0;">
          With deep appreciation &amp; warm regards,<br>
          <strong style="color: #0E1B2E; font-size: 15px;">Precious Uzoamaka &amp; Ugochukwu Omeogu</strong>
        </p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background-color: #0E1B2E; color: #D6B477; padding: 18px; text-align: center; font-size: 11px; letter-spacing: 1px;">
        Strictly by Protocol · Questions: +234 703 431 0865
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const text = `
Precious & Ugochukwu (#UgoAmaka26)
RSVP Received & Under Protocol Review

Dear ${guest.full_name},

Thank you for honoring our union with your RSVP response.
Reference Code: ${guest.reference_code}

${customMsg}

To preserve an intimate banquet atmosphere of strictly 100 guests, registrations are currently undergoing protocol review.
Your personalized Official Invitation Card and confidential venue details will be dispatched directly to your email upon approval.

Warm regards,
Precious & Ugochukwu
Protocol Helpline: +234 703 431 0865
`;

    return { subject, html, text };
  }

  if (type === 'approval') {
    const subject =
      customization?.subject ||
      `Official Wedding Invitation & Seat Confirmation: Precious & Ugochukwu (#UgoAmaka26) [Ref: ${guest.reference_code}]`;

    const customMsg =
      customization?.message ||
      `Precious Uzoamaka and Ugochukwu Omeogu joyfully request the pleasure of your company to celebrate their sacred matrimonial union. Your reserved seating has been officially confirmed by our protocol desk.`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #F4EBD9; font-family: 'Georgia', serif; color: #0E1B2E;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FAF5EA; border: 2px solid #D6B477; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 35px rgba(0,0,0,0.1);">
    <!-- Gold Top Bar -->
    <tr>
      <td height="8" style="background: linear-gradient(90deg, #D6B477, #ECC880, #D6B477);"></td>
    </tr>
    <!-- Header -->
    <tr>
      <td align="center" style="padding: 35px 20px 15px 20px;">
        <div style="font-family: 'Times New Roman', serif; font-size: 34px; font-weight: bold; color: #0E1B2E; letter-spacing: 2px;">
          Precious &amp; Ugochukwu
        </div>
        <div style="font-size: 11px; letter-spacing: 3px; color: #D6B477; text-transform: uppercase; margin-top: 6px; font-weight: bold;">
          The Wedding Celebration · #UgoAmaka26
        </div>
      </td>
    </tr>

    <!-- Official Card Artwork (If present) -->
    ${
      customization?.includeCardImage !== false
        ? `
    <tr>
      <td align="center" style="padding: 10px 30px 20px 30px;">
        <img src="${cardUrl}" alt="Official Invitation Card" style="width: 100%; max-width: 500px; height: auto; border-radius: 12px; border: 2px solid #D6B477; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" />
      </td>
    </tr>
    `
        : ''
    }

    <!-- Content -->
    <tr>
      <td style="padding: 10px 40px 30px 40px; text-align: center;">
        <div style="display: inline-block; padding: 5px 16px; background-color: #0E1B2E; color: #ECC880; border: 1px solid #D6B477; border-radius: 20px; font-size: 11px; font-family: monospace; font-weight: bold; margin-bottom: 18px;">
          VIP ADMISSION REF: ${guest.reference_code}
        </div>

        <p style="font-size: 16px; color: #0E1B2E; margin-bottom: 14px;">
          Honoured Guest: <strong>${guest.full_name}</strong>
        </p>

        <p style="font-size: 14px; line-height: 1.7; color: #333333; margin-bottom: 24px;">
          ${customMsg}
        </p>

        <!-- Event Particulars Grid -->
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFFFF; border: 1px solid #D6B477; border-radius: 14px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 20px; text-align: left;">
              <table width="100%" border="0" cellpadding="4" cellspacing="0">
                <tr>
                  <td width="30%" style="font-size: 11px; font-weight: bold; color: #8A6D3B; text-transform: uppercase;">Date &amp; Time</td>
                  <td width="70%" style="font-size: 13px; font-weight: bold; color: #0E1B2E;">Friday, 13 November 2026 · 4:00 PM WAT</td>
                </tr>
                <tr>
                  <td style="font-size: 11px; font-weight: bold; color: #8A6D3B; text-transform: uppercase;">Arrival Time</td>
                  <td style="font-size: 13px; color: #0E1B2E;">Guests seated promptly by 3:45 PM</td>
                </tr>
                <tr>
                  <td style="font-size: 11px; font-weight: bold; color: #8A6D3B; text-transform: uppercase;">Venue</td>
                  <td style="font-size: 13px; font-weight: bold; color: #0E1B2E;">Tee s Cee Event Center, 6, Faskari Street, Area 3, Garki Abuja</td>
                </tr>
                <tr>
                  <td style="font-size: 11px; font-weight: bold; color: #8A6D3B; text-transform: uppercase;">Access</td>
                  <td style="font-size: 13px; color: #0E1B2E;"><strong>${seats} Seat${hasPlusOne ? 's (+1 Guest)' : ''}</strong></td>
                </tr>
                <tr>
                  <td style="font-size: 11px; font-weight: bold; color: #8A6D3B; text-transform: uppercase;">Table Assigned</td>
                  <td style="font-size: 13px; font-weight: bold; color: #0E1B2E;">${tableAssignment}</td>
                </tr>
                <tr>
                  <td style="font-size: 11px; font-weight: bold; color: #8A6D3B; text-transform: uppercase;">Dress Code</td>
                  <td style="font-size: 12px; color: #0E1B2E;">Strictly Formal Western Black-Tie (No traditional attire)</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Security Notice -->
        <p style="font-size: 12px; color: #777777; line-height: 1.5; margin-bottom: 20px;">
          ⚠️ <em>Strictly by Invitation: Present your reference code <strong>${guest.reference_code}</strong> or digital pass at the security gate. Unlisted guests cannot be accommodated.</em>
        </p>

        <p style="font-size: 13px; color: #666666; line-height: 1.6; margin-bottom: 0;">
          With joyful anticipation,<br>
          <strong style="color: #0E1B2E; font-size: 15px;">Precious &amp; Ugochukwu</strong>
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #0E1B2E; color: #D6B477; padding: 18px; text-align: center; font-size: 11px; letter-spacing: 1px;">
        VIP Protocol Desk · WhatsApp / Helpline: +234 703 431 0865
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const text = `
Precious & Ugochukwu (#UgoAmaka26)
Official Wedding Invitation & Seat Confirmation

Dear ${guest.full_name},

${customMsg}

EVENT DETAILS:
- Verification Code: ${guest.reference_code}
- Date: Friday, 13 November 2026
- Time: 4:00 PM WAT (Please arrive by 3:45 PM)
- Venue: Tee s Cee Event Center, 6, Faskari Street, Area 3, Garki Abuja
- Reserved Access: ${seats} Seat(s)
- Table: ${tableAssignment}
- Dress Code: Strictly Formal Western Black-Tie (No traditional attire)

Please have your reference code (${guest.reference_code}) ready for security verification at the entrance.

We look forward to celebrating with you!
Protocol Helpline: +234 703 431 0865
`;

    return { subject, html, text };
  }

  // Waitlist
  const subject =
    customization?.subject ||
    `Warm Regard & Capacity Update: Precious & Ugochukwu Wedding (#UgoAmaka26)`;

  const customMsg =
    customization?.message ||
    `We are deeply moved and honored by your desire to celebrate with us. Due to intimate venue constraints strictly capped at 100 guests, our banquet seating is presently fully subscribed.`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #F4EBD9; font-family: 'Georgia', serif; color: #0E1B2E;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FAF5EA; border: 2px solid #D6B477; border-radius: 16px; overflow: hidden;">
    <tr>
      <td height="6" style="background: #D6B477;"></td>
    </tr>
    <tr>
      <td align="center" style="padding: 35px 20px 20px 20px;">
        <div style="font-family: 'Times New Roman', serif; font-size: 32px; font-weight: bold; color: #0E1B2E;">
          P &amp; U
        </div>
        <div style="font-size: 11px; letter-spacing: 3px; color: #D6B477; text-transform: uppercase; margin-top: 6px; font-weight: bold;">
          #UgoAmaka26
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 40px 30px 40px; text-align: center;">
        <h2 style="font-size: 18px; font-weight: bold; text-transform: uppercase; color: #0E1B2E;">
          With Sincere Gratitude
        </h2>
        <p style="font-size: 15px; color: #0E1B2E;">Dear ${guest.full_name},</p>
        <p style="font-size: 14px; line-height: 1.7; color: #333333; margin-bottom: 20px;">
          ${customMsg}
        </p>
        <p style="font-size: 13px; color: #555555; line-height: 1.6;">
          Your name remains on our priority waitlist. Should seating open, our protocol team will reach out immediately. We carry your prayers and heartfelt love in our hearts.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #0E1B2E; color: #D6B477; padding: 16px; text-align: center; font-size: 11px;">
        Protocol Desk: +234 703 431 0865
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const text = `
Precious & Ugochukwu (#UgoAmaka26)

Dear ${guest.full_name},

${customMsg}

Your name is on our priority list. We cherish your warm love and prayers.

Warmly,
Precious & Ugochukwu
`;

  return { subject, html, text };
}

/**
 * Generate a mailto link with encoded subject and body for immediate client-side opening
 */
export function generateMailtoUrl(to: string, subject: string, bodyText: string): string {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
}

/**
 * Dispatch email via server API route /api/send-email or fallback
 */
export async function sendEmailViaService(payload: {
  to: string;
  subject: string;
  html: string;
  text: string;
  apiKey?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        message: err.error || `Server responded with ${res.status}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      message: data.message || 'Email successfully dispatched.',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Failed to connect to email service: ${msg}`,
    };
  }
}
