import { RSVPRecord } from '../types/rsvp';
import { getOfficialCardUrl } from '../lib/invitationCardAsset';
import { generateInvitationCardCanvas } from '../lib/invitationCardGenerator';

export type WeddingEmailType = 'acknowledgment' | 'approval' | 'declined' | 'waitlist';
export type WeddingCardTheme = 'floral-cream' | 'modern-gold' | 'midnight-navy';

export interface EmailCustomization {
  subject?: string;
  message?: string;
  cardTheme?: WeddingCardTheme;
  includeCardImage?: boolean;
  includeVenueDetails?: boolean;
}

export interface GeneratedEmail {
  subject: string;
  html: string;
  text: string;
}

/**
 * Replace placeholders like {{guest_name}}, {{reference_code}}, {{seats}}, {{table_assignment}}, {{date}}, {{venue}}
 */
export function replacePlaceholders(template: string, guest: RSVPRecord): string {
  const seats = guest.allocated_seats || guest.guest_count || 1;
  const table = guest.table_assignment || 'VIP Protocol Table';

  return template
    .replace(/\{\{guest_name\}\}/gi, guest.full_name || 'Esteemed Guest')
    .replace(/\{\{reference_code\}\}/gi, guest.reference_code || 'PU-PASS')
    .replace(/\{\{seats\}\}/gi, `${seats}`)
    .replace(/\{\{table_assignment\}\}/gi, table)
    .replace(/\{\{date\}\}/gi, 'Friday, 13 November 2026')
    .replace(/\{\{time\}\}/gi, '10:00 AM Prompt')
    .replace(/\{\{venue\}\}/gi, 'Tee s Cee Event Center, 6, Faskari Street, Area 3, Garki Abuja')
    .replace(/\{\{dress_code\}\}/gi, 'Strictly Black-Tie Formal Western Attire')
    .replace(/\{\{status\}\}/gi, guest.status === 'approved' ? 'Approved' : guest.status === 'declined' ? 'Declined' : 'Pending');
}

/**
 * Generate luxury responsive HTML email for wedding guests (off-white cream royal theme with floral flourishes)
 */
export function generateWeddingEmail(
  type: WeddingEmailType,
  guest: RSVPRecord,
  customization?: EmailCustomization
): GeneratedEmail {
  const seats = guest.allocated_seats || guest.guest_count || 1;
  const hasPlusOne = seats > 1;
  const tableAssignment = guest.table_assignment || 'VIP Protocol Table';
  const cardTheme: WeddingCardTheme = customization?.cardTheme || 'floral-cream';
  const appBaseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ugoamaka26.com';
  const passUrl = `${appBaseUrl}/?ref=${encodeURIComponent(guest.reference_code)}&view=pass`;

  // 1. ACKNOWLEDGMENT (RSVP RECEIVED & UNDER PROTOCOL REVIEW)
  if (type === 'acknowledgment') {
    const defaultSubject = `RSVP Received: Precious & Ugochukwu Wedding (#UgoAmaka26) [Ref: ${guest.reference_code}]`;
    const subject = customization?.subject ? replacePlaceholders(customization.subject, guest) : defaultSubject;

    const defaultMsg = `Thank you for honoring our upcoming union with your RSVP response. Because our wedding banquet is curated for an intimate gathering of strictly 100 guests, all responses are currently undergoing protocol review.`;
    const customMsg = customization?.message ? replacePlaceholders(customization.message, guest) : defaultMsg;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #F5EFEB; font-family: 'Georgia', serif; color: #0E1B2E;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #FCFAF6; border: 3px solid #C8A665; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 40px rgba(60,40,10,0.08);">
    <tr>
      <td height="6" style="background: linear-gradient(90deg, #BCA063, #E8D09E, #BCA063);"></td>
    </tr>
    <tr>
      <td align="center" style="padding: 36px 24px 16px 24px;">
        <div style="font-family: 'Times New Roman', serif; font-size: 32px; font-weight: bold; color: #9C7A35; letter-spacing: 2px;">
          P &amp; U
        </div>
        <div style="font-size: 11px; letter-spacing: 3px; color: #9C7A35; text-transform: uppercase; margin-top: 6px; font-weight: bold; font-family: sans-serif;">
          #UGOAMAKA26 · 13 NOVEMBER 2026
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 40px 32px 40px; text-align: center;">
        <h2 style="font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: #0E1B2E; margin-bottom: 8px;">
          RSVP Received
        </h2>
        <div style="display: inline-block; padding: 5px 16px; background-color: #0E1B2E; color: #ECC880; border: 1px solid #D6B477; border-radius: 20px; font-size: 11px; font-family: monospace; font-weight: bold; margin-bottom: 20px;">
          Ref Code: ${guest.reference_code}
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #0E1B2E; margin-bottom: 16px;">
          Dear <strong>${guest.full_name}</strong>,
        </p>

        <p style="font-size: 14px; line-height: 1.7; color: #4A4A4A; margin-bottom: 24px;">
          ${customMsg}
        </p>

        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFDF9; border: 1px solid #D6B477; border-radius: 12px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 18px; text-align: left;">
              <div style="font-size: 12px; font-weight: bold; color: #9C7A35; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; font-family: sans-serif;">
                ⏳ Protocol Seating Review in Progress
              </div>
              <div style="font-size: 13px; color: #555555; line-height: 1.6;">
                To safeguard our celebration's security and intimate seating strictly limited to 100 guests, the official venue address and your personalized <strong>Official Invitation Card &amp; Security Gate Pass</strong> will be dispatched to this email upon protocol clearance.
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
    <tr>
      <td style="background-color: #0E1B2E; color: #D6B477; padding: 16px; text-align: center; font-size: 11px; font-family: sans-serif;">
        VIP Protocol Desk · Helpline: +234 803 123 4567
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
Your personalized Official Invitation Card will be dispatched upon approval.

Warm regards,
Precious & Ugochukwu
`;

    return { subject, html, text };
  }

  // 2. APPROVAL (LUXURY FLORAL CREAM WEDDING INVITATION CARD IN EMAIL)
  if (type === 'approval') {
    const defaultSubject = `Official Wedding Invitation & Security Pass: Precious & Ugochukwu (#UgoAmaka26) [Ref: ${guest.reference_code}]`;
    const subject = customization?.subject ? replacePlaceholders(customization.subject, guest) : defaultSubject;

    const defaultMsg = `Precious Uzoamaka and Ugochukwu Omeogu joyfully request the pleasure of your company to celebrate their sacred matrimonial union and nuptial banquet. Your reserved seating has been officially confirmed by our protocol desk.`;
    const customMsg = customization?.message ? replacePlaceholders(customization.message, guest) : defaultMsg;

    // Theme variations
    const isNavyTheme = cardTheme === 'midnight-navy';
    const cardBg = isNavyTheme ? '#0E1B2E' : '#FCFAF6';
    const cardText = isNavyTheme ? '#FFFFFF' : '#0E1B2E';
    const cardSubtext = isNavyTheme ? '#A5B5C8' : '#5A6E82';
    const plaqueBg = isNavyTheme ? '#142338' : '#FFFDF9';
    const borderGold = isNavyTheme ? '#D6B477' : '#BCA063';
    const innerBorder = isNavyTheme ? 'rgba(214, 180, 119, 0.4)' : 'rgba(188, 160, 99, 0.4)';
    const gridCardBg = isNavyTheme ? '#121F33' : '#FFFFFF';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #F4EFE6; font-family: 'Georgia', serif; color: ${cardText};">

  <!-- MAIN STATIONERY INVITATION CARD CONTAINER -->
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: ${cardBg}; border: 3.5px solid ${borderGold}; border-radius: 18px; overflow: hidden; box-shadow: 0 16px 50px rgba(60,40,10,0.12);">
    
    <!-- Gold Foil Header Strip -->
    <tr>
      <td height="8" style="background: linear-gradient(90deg, #BCA063, #E8D09E, #D6B477, #BCA063);"></td>
    </tr>

    <!-- Floral Spray Botanical Header & Monogram Emblem -->
    <tr>
      <td align="center" style="padding: 28px 24px 10px 24px;">
        
        <!-- Botanical Watercolor Rose & Branch SVG Flourish -->
        <div style="margin-bottom: 12px; line-height: 0;">
          <svg width="220" height="32" viewBox="0 0 220 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 16C45 16 65 8 90 14" stroke="#7E947A" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M210 16C175 16 155 8 130 14" stroke="#7E947A" stroke-width="1.5" stroke-linecap="round"/>
            <ellipse cx="65" cy="11" rx="7" ry="4" fill="#8EA68B" transform="rotate(-15 65 11)"/>
            <ellipse cx="155" cy="11" rx="7" ry="4" fill="#8EA68B" transform="rotate(15 155 11)"/>
            <ellipse cx="40" cy="17" rx="6" ry="3.5" fill="#D6B477" transform="rotate(10 40 17)"/>
            <ellipse cx="180" cy="17" rx="6" ry="3.5" fill="#D6B477" transform="rotate(-10 180 17)"/>
            <!-- Center Rose Blossom -->
            <circle cx="110" cy="16" r="10" fill="#FFFBF5" stroke="#E5CAA8" stroke-width="1.5"/>
            <circle cx="110" cy="16" r="5" fill="#F5E4D0" stroke="#BCA063" stroke-width="1"/>
            <!-- Gold pollen dots -->
            <circle cx="98" cy="14" r="1.5" fill="#BCA063"/>
            <circle cx="122" cy="14" r="1.5" fill="#BCA063"/>
          </svg>
        </div>

        <!-- Royal Monogram Emblem -->
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 12px auto;">
          <tr>
            <td align="center" style="width: 72px; height: 72px; border: 2.5px solid ${borderGold}; border-radius: 50%; background-color: ${plaqueBg}; box-shadow: inset 0 0 0 3px ${innerBorder};">
              <span style="font-family: 'Times New Roman', Georgia, serif; font-size: 26px; font-weight: bold; color: #9C7A35; letter-spacing: 2px;">
                P &amp; U
              </span>
            </td>
          </tr>
        </table>

        <!-- Hashtag & Ceremony Banner -->
        <div style="font-family: 'Montserrat', -apple-system, sans-serif; font-size: 11.5px; letter-spacing: 3.5px; color: #9C7A35; text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">
          #UGOAMAKA26 · ROYAL NUPTIALS
        </div>

        <!-- Official Invitation Title -->
        <h1 style="font-family: 'Cinzel', 'Playfair Display', Georgia, serif; font-size: 19px; font-weight: bold; letter-spacing: 1.5px; color: ${cardText}; text-transform: uppercase; margin: 4px 0 6px 0;">
          Official Wedding Invitation &amp; Security Pass
        </h1>
        <div style="font-style: italic; font-size: 14px; color: ${cardSubtext}; margin-bottom: 12px;">
          The Holy Matrimony &amp; Nuptial Banquet of
        </div>

        <!-- Couple Names -->
        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: bold; color: ${cardText}; letter-spacing: 0.5px; margin-bottom: 14px;">
          Precious Uzoamaka &amp; Ugochukwu Omeogu
        </div>

        <!-- Golden Filigree Divider with Diamond -->
        <div style="color: #BCA063; font-size: 14px; letter-spacing: 4px; margin-bottom: 18px;">
          ─── ◆ ───
        </div>
      </td>
    </tr>

    <!-- HONOURED GUEST PLAQUE -->
    <tr>
      <td style="padding: 0 28px 24px 28px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${plaqueBg}; border: 1.8px solid ${borderGold}; border-radius: 14px; box-shadow: 0 4px 15px rgba(0,0,0,0.04);">
          <tr>
            <td style="padding: 22px 20px; text-align: center;">
              <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; letter-spacing: 3px; font-weight: bold; color: #9C7A35; text-transform: uppercase; margin-bottom: 8px;">
                GUEST OF HONOUR
              </div>
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: bold; color: ${cardText}; margin-bottom: 6px;">
                ${guest.full_name}
              </div>
              <div style="font-style: italic; font-size: 13.5px; color: ${cardSubtext};">
                ${guest.guest_names && guest.guest_names !== guest.full_name ? `Accompanying: ${guest.guest_names} · ` : ''}Cordially Invited to Share in Our Joy
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- PERSONAL INVITATION MESSAGE -->
    <tr>
      <td style="padding: 0 36px 20px 36px; text-align: center;">
        <p style="font-size: 14px; line-height: 1.75; color: ${isNavyTheme ? '#D2DEEB' : '#3D4D5C'}; margin: 0;">
          ${customMsg}
        </p>
      </td>
    </tr>

    <!-- EVENT & SECURITY PARTICULARS MATRIX (2-COLUMN GRID) -->
    <tr>
      <td style="padding: 0 28px 24px 28px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${gridCardBg}; border: 1.5px solid ${borderGold}; border-radius: 14px; overflow: hidden;">
          
          <!-- Row 1: Access & Table Assignment -->
          <tr>
            <td width="50%" style="padding: 14px 18px; border-bottom: 1px solid ${innerBorder}; border-right: 1px solid ${innerBorder}; text-align: left;">
              <div style="font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: bold; color: #9C7A35; text-transform: uppercase; letter-spacing: 1px;">
                ACCESS PERMITTED
              </div>
              <div style="font-size: 14px; font-weight: bold; color: ${cardText}; margin-top: 3px;">
                ${seats} Reserved Seat${hasPlusOne ? 's (+1 Guest)' : ''}
              </div>
            </td>
            <td width="50%" style="padding: 14px 18px; border-bottom: 1px solid ${innerBorder}; text-align: left;">
              <div style="font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: bold; color: #9C7A35; text-transform: uppercase; letter-spacing: 1px;">
                TABLE ASSIGNMENT
              </div>
              <div style="font-size: 14px; font-weight: bold; color: ${cardText}; margin-top: 3px;">
                ${tableAssignment}
              </div>
            </td>
          </tr>

          <!-- Row 2: Security Ref & Date/Time -->
          <tr>
            <td style="padding: 14px 18px; border-bottom: 1px solid ${innerBorder}; border-right: 1px solid ${innerBorder}; text-align: left;">
              <div style="font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: bold; color: #9C7A35; text-transform: uppercase; letter-spacing: 1px;">
                SECURITY REF CODE
              </div>
              <div style="font-family: monospace; font-size: 15px; font-weight: bold; color: ${isNavyTheme ? '#ECC880' : '#0E1B2E'}; margin-top: 3px;">
                ${guest.reference_code}
              </div>
            </td>
            <td style="padding: 14px 18px; border-bottom: 1px solid ${innerBorder}; text-align: left;">
              <div style="font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: bold; color: #9C7A35; text-transform: uppercase; letter-spacing: 1px;">
                DATE &amp; TIME
              </div>
              <div style="font-size: 13px; font-weight: bold; color: ${cardText}; margin-top: 3px;">
                Friday, 13 Nov 2026 · 10:00 AM Prompt
              </div>
            </td>
          </tr>

          <!-- Row 3: Official Venue (Full Width) -->
          <tr>
            <td colspan="2" style="padding: 14px 18px; border-bottom: 1px solid ${innerBorder}; text-align: left;">
              <div style="font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: bold; color: #9C7A35; text-transform: uppercase; letter-spacing: 1px;">
                OFFICIAL VENUE
              </div>
              <div style="font-size: 13.5px; font-weight: bold; color: ${cardText}; margin-top: 3px;">
                Tee s Cee Event Center · 6, Faskari Street, Area 3, Garki Abuja
              </div>
            </td>
          </tr>

          <!-- Row 4: Dress Code Protocol (Full Width) -->
          <tr>
            <td colspan="2" style="padding: 14px 18px; text-align: left;">
              <div style="font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: bold; color: #9C7A35; text-transform: uppercase; letter-spacing: 1px;">
                DRESS CODE PROTOCOL
              </div>
              <div style="font-size: 12.5px; color: ${cardText}; margin-top: 3px;">
                <strong>Strictly Black-Tie Formal Western Attire</strong> (No Traditional Attire)
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>

    <!-- LOWER SECURITY SECTION: QR CODE & ROYAL WAX SEAL -->
    <tr>
      <td style="padding: 0 28px 24px 28px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${plaqueBg}; border: 1px solid ${borderGold}; border-radius: 12px;">
          <tr>
            
            <!-- Left: QR Code info -->
            <td width="55%" style="padding: 18px; text-align: left; vertical-align: middle;">
              <div style="font-family: 'Montserrat', sans-serif; font-size: 10.5px; font-weight: bold; color: #9C7A35; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
                GATE SCANNING PROTOCOL
              </div>
              <div style="font-size: 12px; color: ${cardSubtext}; line-height: 1.5;">
                Present your <strong>PU-${guest.reference_code}</strong> reference code or attached high-resolution JPEG pass at the gate. Admittance is non-transferable.
              </div>
            </td>

            <!-- Right: Royal Crimson Wax Seal Emblem -->
            <td width="45%" align="center" style="padding: 18px; vertical-align: middle;">
              <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="width: 76px; height: 76px; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #A31C28, #6B0E17, #45080E); border: 2px solid #D6B477; box-shadow: 0 4px 12px rgba(70,10,20,0.3); text-align: center;">
                    <div style="font-size: 7.5px; font-family: 'Montserrat', sans-serif; color: #ECC880; font-weight: bold; letter-spacing: 1px;">PROTOCOL</div>
                    <div style="font-family: 'Times New Roman', serif; font-size: 20px; font-weight: bold; color: #FFFFFF; line-height: 22px;">PU</div>
                    <div style="font-size: 7.5px; font-family: 'Montserrat', sans-serif; color: #ECC880; font-weight: bold; letter-spacing: 1px;">ENTRY</div>
                  </td>
                </tr>
              </table>
            </td>

          </tr>
        </table>
      </td>
    </tr>

    <!-- INTERACTIVE ACTION BUTTONS -->
    <tr>
      <td style="padding: 0 28px 30px 28px; text-align: center;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 12px auto;">
          <tr>
            <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #0E1B2E, #1A2E47); box-shadow: 0 6px 20px rgba(14,27,46,0.25);">
              <a href="${passUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: bold; color: #ECC880; text-decoration: none; text-transform: uppercase; letter-spacing: 1.5px;">
                📱 View &amp; Download Pass Card (JPEG) →
              </a>
            </td>
          </tr>
        </table>

        <!-- Secondary Links -->
        <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; color: ${cardSubtext}; margin-top: 10px;">
          <a href="https://maps.google.com/?q=Tee+s+Cee+Event+Center+Area+3+Garki+Abuja" target="_blank" style="color: #9C7A35; text-decoration: none; font-weight: bold; margin: 0 10px;">
            📍 Venue Map
          </a>
          ·
          <a href="${passUrl}" target="_blank" style="color: #9C7A35; text-decoration: none; font-weight: bold; margin: 0 10px;">
            📅 Calendar Reminder
          </a>
        </div>
      </td>
    </tr>

    <!-- Security Disclaimer Footer -->
    <tr>
      <td style="background-color: #0E1B2E; color: #D6B477; padding: 20px 24px; text-align: center;">
        <div style="font-family: 'Montserrat', sans-serif; font-size: 10.5px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: bold; margin-bottom: 4px;">
          STRICTLY BY INVITATION · PROTOCOL DESK
        </div>
        <div style="font-size: 11px; color: #A5B5C8;">
          VIP Desk: +234 803 123 4567 · Abuja, Nigeria
        </div>
      </td>
    </tr>

  </table>

</body>
</html>
`;

    const text = `
Official Wedding Invitation & Security Pass
Precious Uzoamaka & Ugochukwu Omeogu (#UgoAmaka26)

Honoured Guest: ${guest.full_name}
Security Reference Code: ${guest.reference_code}

${customMsg}

EVENT DETAILS:
- Date: Friday, 13 November 2026
- Time: 10:00 AM Prompt (Guests seated by 9:45 AM)
- Venue: Tee s Cee Event Center, 6, Faskari Street, Area 3, Garki Abuja
- Access: ${seats} Reserved Seat(s)
- Table: ${tableAssignment}
- Dress Code: Strictly Black-Tie Formal Western Attire (No traditional attire)

View and save your digital pass online:
${passUrl}

Please have your reference code (${guest.reference_code}) ready for security verification at the entrance.
Protocol Helpline: +234 803 123 4567
`;

    return { subject, html, text };
  }

  // 3. DECLINED / REJECTED (WARM CAPACITY REGRETS)
  if (type === 'declined') {
    const isSelfDeclined = guest.attendance === 'declined';
    const defaultSubject = isSelfDeclined
      ? `RSVP Update: Precious & Ugochukwu Wedding (#UgoAmaka26) [Ref: ${guest.reference_code}]`
      : `With Sincere Warmth: Precious & Ugochukwu Wedding (#UgoAmaka26) [Ref: ${guest.reference_code}]`;

    const subject = customization?.subject ? replacePlaceholders(customization.subject, guest) : defaultSubject;

    const defaultMsg = isSelfDeclined
      ? `Thank you for letting us know that you are unable to attend our wedding celebration. We will miss celebrating with you in person and we carry your warm wishes and prayers in our hearts as we step into this holy matrimony.`
      : `Thank you so much for your heartfelt response and desire to celebrate with us. Because our banquet venue has strict physical capacity constraints limited strictly to 100 guests, our seating is currently completely at capacity and we are regretfully unable to accommodate additional guests at this time. We sincerely cherish your warm wishes, prayers, and blessings.`;

    const customMsg = customization?.message ? replacePlaceholders(customization.message, guest) : defaultMsg;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #F5EFEB; font-family: 'Georgia', serif; color: #0E1B2E;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #FCFAF6; border: 3px solid #C8A665; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 40px rgba(60,40,10,0.08);">
    <tr>
      <td height="6" style="background: #C8A665;"></td>
    </tr>
    <tr>
      <td align="center" style="padding: 36px 24px 16px 24px;">
        <div style="font-family: 'Times New Roman', serif; font-size: 32px; font-weight: bold; color: #9C7A35;">
          P &amp; U
        </div>
        <div style="font-size: 11px; letter-spacing: 3px; color: #9C7A35; text-transform: uppercase; margin-top: 6px; font-weight: bold; font-family: sans-serif;">
          #UGOAMAKA26
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 40px 32px 40px; text-align: center;">
        <h2 style="font-size: 19px; font-weight: bold; text-transform: uppercase; color: #0E1B2E; margin-bottom: 8px;">
          With Sincere Gratitude &amp; Love
        </h2>
        <div style="display: inline-block; padding: 4px 14px; background-color: #F5EFEB; color: #8A6D3B; border-radius: 20px; font-size: 11px; font-family: monospace; font-weight: bold; margin-bottom: 20px;">
          Ref: ${guest.reference_code}
        </div>

        <p style="font-size: 15px; color: #0E1B2E; margin-bottom: 16px;">
          Dear <strong>${guest.full_name}</strong>,
        </p>

        <p style="font-size: 14px; line-height: 1.7; color: #4A4A4A; margin-bottom: 24px;">
          ${customMsg}
        </p>

        <div style="padding: 16px; background-color: #FFFDF9; border: 1px solid #E8DCBE; border-radius: 12px; margin-bottom: 24px; text-align: left;">
          <p style="margin: 0; font-size: 13px; color: #555555; line-height: 1.6;">
            🕊️ <em>Though we cannot celebrate side-by-side on this occasion, your love and friendship mean the world to both of us. We ask for your continued prayers over our new home.</em>
          </p>
        </div>

        <p style="font-size: 13px; color: #666666; line-height: 1.6; margin-bottom: 0;">
          With deep appreciation &amp; warmest blessings,<br>
          <strong style="color: #0E1B2E; font-size: 15px;">Precious Uzoamaka &amp; Ugochukwu Omeogu</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #0E1B2E; color: #D6B477; padding: 16px; text-align: center; font-size: 11px; font-family: sans-serif;">
        VIP Protocol Desk · #UgoAmaka26
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const text = `
Precious & Ugochukwu (#UgoAmaka26)
Ref: ${guest.reference_code}

Dear ${guest.full_name},

${customMsg}

Though we cannot celebrate in person on this occasion, your prayers and goodwill mean the world to us.

With warm love & blessings,
Precious & Ugochukwu
`;

    return { subject, html, text };
  }

  // 4. WAITLIST (CAPACITY WAITLIST)
  const defaultSubject = `Warm Regard & Capacity Update: Precious & Ugochukwu Wedding (#UgoAmaka26) [Ref: ${guest.reference_code}]`;
  const subject = customization?.subject ? replacePlaceholders(customization.subject, guest) : defaultSubject;

  const defaultMsg = `We are deeply moved and honored by your desire to celebrate with us. Due to intimate venue constraints strictly capped at 100 guests, our banquet seating is presently fully subscribed.`;
  const customMsg = customization?.message ? replacePlaceholders(customization.message, guest) : defaultMsg;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #F5EFEB; font-family: 'Georgia', serif; color: #0E1B2E;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #FCFAF6; border: 3px solid #C8A665; border-radius: 18px; overflow: hidden;">
    <tr>
      <td height="6" style="background: #C8A665;"></td>
    </tr>
    <tr>
      <td align="center" style="padding: 36px 24px 16px 24px;">
        <div style="font-family: 'Times New Roman', serif; font-size: 32px; font-weight: bold; color: #9C7A35;">
          P &amp; U
        </div>
        <div style="font-size: 11px; letter-spacing: 3px; color: #9C7A35; text-transform: uppercase; margin-top: 6px; font-weight: bold;">
          #UGOAMAKA26
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 40px 32px 40px; text-align: center;">
        <h2 style="font-size: 18px; font-weight: bold; text-transform: uppercase; color: #0E1B2E;">
          With Sincere Gratitude
        </h2>
        <p style="font-size: 15px; color: #0E1B2E;">Dear <strong>${guest.full_name}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.7; color: #4A4A4A; margin-bottom: 20px;">
          ${customMsg}
        </p>
        <p style="font-size: 13px; color: #555555; line-height: 1.6;">
          Your name remains on our priority waitlist. Should seating open, our protocol team will reach out immediately. We carry your prayers and heartfelt love in our hearts.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #0E1B2E; color: #D6B477; padding: 16px; text-align: center; font-size: 11px;">
        Protocol Desk: +234 803 123 4567
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
 * Generate a direct 1-click Gmail Web compose URL
 */
export function generateGmailComposeUrl(to: string, subject: string, bodyText: string): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
}

/**
 * Dispatch email via server API route /api/send-email (Resend backend)
 */
export async function sendEmailViaService(payload: {
  to: string;
  subject: string;
  html: string;
  text: string;
  apiKey?: string;
  attachments?: Array<{ filename: string; content: string }>;
}): Promise<{ success: boolean; message: string; simulated?: boolean }> {
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
      simulated: data.simulated,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Failed to connect to email service: ${msg}`,
    };
  }
}

/**
 * Automatically triggers confirmation email via Resend when RSVP status is updated.
 * Also generates and attaches the personalized 1200x1800 px JPEG invitation card!
 */
export async function sendAutomatedRSVPEmail(
  guest: RSVPRecord,
  newStatus: 'approved' | 'declined' | 'waitlisted',
  options?: {
    allocatedSeats?: number;
    tableAssignment?: string;
    cardTheme?: WeddingCardTheme;
  }
): Promise<{ success: boolean; message: string; simulated?: boolean }> {
  if (!guest.email || !guest.email.includes('@')) {
    return {
      success: false,
      message: `No email address on file for ${guest.full_name}`,
    };
  }

  const updatedRecord: RSVPRecord = {
    ...guest,
    status: newStatus,
    allocated_seats: options?.allocatedSeats ?? guest.allocated_seats ?? guest.guest_count ?? 1,
    table_assignment: options?.tableAssignment ?? guest.table_assignment ?? 'VIP Protocol Table',
  };

  const emailType: WeddingEmailType =
    newStatus === 'approved' ? 'approval' : newStatus === 'declined' ? 'declined' : 'waitlist';

  const generated = generateWeddingEmail(emailType, updatedRecord, {
    cardTheme: options?.cardTheme || 'floral-cream',
  });

  // Generate high-resolution personalized JPEG card attachment if approved
  let attachments: Array<{ filename: string; content: string }> | undefined = undefined;
  if (typeof document !== 'undefined' && newStatus === 'approved') {
    try {
      const canvas = await generateInvitationCardCanvas(updatedRecord);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      const base64 = dataUrl.split(',')[1];
      if (base64) {
        attachments = [
          {
            filename: `Official_Wedding_Invitation_PU_${updatedRecord.reference_code}.jpeg`,
            content: base64,
          },
        ];
      }
    } catch (canvasErr) {
      console.warn('Notice: Personalized card canvas generation for attachment deferred:', canvasErr);
    }
  }

  const storedKey = typeof localStorage !== 'undefined' ? localStorage.getItem('ugoamaka26_resend_key') : null;

  return await sendEmailViaService({
    to: guest.email,
    subject: generated.subject,
    html: generated.html,
    text: generated.text,
    apiKey: storedKey || undefined,
    attachments,
  });
}
