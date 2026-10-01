import QRCode from 'qrcode';
import { RSVPRecord } from '../types/rsvp';

/**
 * Generates an ultra-high-resolution (1200x1800 px) personalized official wedding invitation card & security pass
 * rendered as a pristine JPEG image ready for download to mobile phones or printing.
 */
export async function generateInvitationCardCanvas(record: RSVPRecord): Promise<HTMLCanvasElement> {
  const width = 1200;
  const height = 1800;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // 1. Deep Midnight Navy Background with subtle Luxury Radial Glow
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, 950);
  bgGrad.addColorStop(0, '#13233A');
  bgGrad.addColorStop(0.65, '#0B1525');
  bgGrad.addColorStop(1, '#050A12');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle decorative damask/starburst dust effect
  ctx.fillStyle = 'rgba(214, 180, 119, 0.04)';
  for (let i = 0; i < 90; i++) {
    const rx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
    const ry = (Math.cos(i * 77) * 0.5 + 0.5) * height;
    ctx.beginPath();
    ctx.arc(rx, ry, (i % 3) + 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Luxury Outer Gold Borders
  ctx.strokeStyle = '#D6B477';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Inner Ornate Border
  ctx.strokeStyle = 'rgba(214, 180, 119, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(55, 55, width - 110, height - 110);

  // Corner filigree brackets & diamonds
  const corners = [
    [40, 40],
    [width - 40, 40],
    [40, height - 40],
    [width - 40, height - 40],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = '#ECC880';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    // Corner brackets
    ctx.strokeStyle = '#ECC880';
    ctx.lineWidth = 3;
    const dirX = cx === 40 ? 1 : -1;
    const dirY = cy === 40 ? 1 : -1;

    ctx.beginPath();
    ctx.moveTo(cx + dirX * 25, cy);
    ctx.lineTo(cx + dirX * 5, cy);
    ctx.lineTo(cx + dirX * 5, cy + dirY * 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy + dirY * 25);
    ctx.lineTo(cx, cy + dirY * 5);
    ctx.lineTo(cx + dirX * 20, cy + dirY * 5);
    ctx.stroke();
  });

  // 3. Top Royal Crest & Monogram Emblem
  const crestY = 160;
  ctx.save();
  // Gold circle with dashed outer ring
  ctx.strokeStyle = '#D6B477';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(width / 2, crestY, 60, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(236, 200, 128, 0.4)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(width / 2, crestY, 68, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Monogram P & U
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 44px "Cinzel", "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#ECC880';
  ctx.fillText('P & U', width / 2, crestY);
  ctx.restore();

  // Hashtag & Nuptial Tagline
  ctx.textAlign = 'center';
  ctx.font = 'bold 16px "Montserrat", sans-serif';
  ctx.fillStyle = '#D6B477';
  ctx.letterSpacing = '5px';
  ctx.fillText('#UGOAMAKA26 · ROYAL NUPTIALS', width / 2, crestY + 95);

  // 4. Header Titles
  ctx.font = 'bold 24px "Cinzel", "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#ECC880';
  ctx.fillText('OFFICIAL WEDDING INVITATION & SECURITY PASS', width / 2, crestY + 145);

  ctx.font = 'italic 20px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#A4C4DC';
  ctx.fillText('The Holy Matrimony & Nuptial Banquet of', width / 2, crestY + 185);

  ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Precious Uzoamaka & Ugochukwu Omeogu', width / 2, crestY + 235);

  // Filigree divider line with central diamond
  const divY = crestY + 275;
  ctx.strokeStyle = '#D6B477';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 250, divY);
  ctx.lineTo(width / 2 - 20, divY);
  ctx.moveTo(width / 2 + 20, divY);
  ctx.lineTo(width / 2 + 250, divY);
  ctx.stroke();

  ctx.fillStyle = '#ECC880';
  ctx.save();
  ctx.translate(width / 2, divY);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-7, -7, 14, 14);
  ctx.restore();

  // 5. Honoured Guest Plaque (Luxury Parchment Card)
  const plaqueY = divY + 35;
  const plaqueH = 175;
  const plaqueW = width - 180;
  const plaqueX = (width - plaqueW) / 2;

  // Plaque Background
  ctx.fillStyle = 'rgba(236, 200, 128, 0.08)';
  ctx.strokeStyle = 'rgba(214, 180, 119, 0.6)';
  ctx.lineWidth = 2;
  roundRect(ctx, plaqueX, plaqueY, plaqueW, plaqueH, 18);
  ctx.fill();
  ctx.stroke();

  // Plaque inner border
  ctx.strokeStyle = 'rgba(214, 180, 119, 0.25)';
  ctx.lineWidth = 1;
  roundRect(ctx, plaqueX + 8, plaqueY + 8, plaqueW - 16, plaqueH - 16, 12);
  ctx.stroke();

  // Guest Label
  ctx.textAlign = 'center';
  ctx.font = 'bold 15px "Montserrat", sans-serif';
  ctx.fillStyle = '#D6B477';
  ctx.fillText('GUEST OF HONOUR', width / 2, plaqueY + 45);

  // Guest Name (auto-adjust size if name is long)
  const guestName = record.full_name || 'Esteemed Guest';
  ctx.font = guestName.length > 25 ? 'bold 36px "Playfair Display", Georgia, serif' : 'bold 44px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(guestName, width / 2, plaqueY + 95);

  // If plus one / accompanying name
  if (record.guest_names && record.guest_names !== record.full_name) {
    ctx.font = 'italic 18px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#A4C4DC';
    ctx.fillText(`Accompanying: ${record.guest_names}`, width / 2, plaqueY + 138);
  } else {
    ctx.font = '14px "Montserrat", sans-serif';
    ctx.fillStyle = '#A4C4DC';
    ctx.fillText('Cordially Invited to Share in Our Joy', width / 2, plaqueY + 138);
  }

  // 6. Security Particulars & Event Particulars Grid
  const gridY = plaqueY + plaqueH + 35;
  const gridW = width - 180;
  const gridX = (width - gridW) / 2;
  const colW = (gridW - 20) / 2;

  const seats = record.allocated_seats || record.guest_count || 1;
  const tableAssignment = record.table_assignment || 'VIP Protocol Table';

  const rows = [
    { label: 'ACCESS PERMITTED', val: `${seats} Reserved Seat(s)`, col: 0, row: 0 },
    { label: 'TABLE ASSIGNMENT', val: tableAssignment, col: 1, row: 0 },
    { label: 'SECURITY REF CODE', val: record.reference_code, col: 0, row: 1 },
    { label: 'DATE & TIME', val: 'Friday, 13 Nov 2026 · 10:00 AM Prompt', col: 1, row: 1 },
  ];

  rows.forEach((item) => {
    const x = gridX + item.col * (colW + 20);
    const y = gridY + item.row * 90;
    const h = 76;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(214, 180, 119, 0.35)';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, colW, h, 12);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = 'bold 12px "Montserrat", sans-serif';
    ctx.fillStyle = '#ECC880';
    ctx.fillText(item.label, x + 20, y + 28);

    ctx.font = 'bold 20px "Cinzel", "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(item.val, x + 20, y + 56);
  });

  // Venue & Dress Code Full-Width Rows
  const venueY = gridY + 195;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.strokeStyle = 'rgba(214, 180, 119, 0.35)';
  roundRect(ctx, gridX, venueY, gridW, 76, 12);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.font = 'bold 12px "Montserrat", sans-serif';
  ctx.fillStyle = '#ECC880';
  ctx.fillText('OFFICIAL VENUE', gridX + 20, venueY + 28);

  ctx.font = 'bold 19px "Cinzel", "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Tee s Cee Event Center · 6, Faskari Street, Area 3, Garki Abuja', gridX + 20, venueY + 56);

  // Dress Code Row
  const dressY = venueY + 90;
  ctx.fillStyle = 'rgba(236, 200, 128, 0.07)';
  ctx.strokeStyle = 'rgba(236, 200, 128, 0.5)';
  roundRect(ctx, gridX, dressY, gridW, 70, 12);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.font = 'bold 12px "Montserrat", sans-serif';
  ctx.fillStyle = '#ECC880';
  ctx.fillText('DRESS CODE PROTOCOL', gridX + 20, dressY + 26);

  ctx.font = 'bold 18px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Strictly Black-Tie Formal Western Attire (No Traditional Attire)', gridX + 20, dressY + 52);

  // 7. Security Barcode / QR Code & Wax Seal Section
  const lowerY = dressY + 105;

  // Generate QR Code data URL
  const qrData = `UGOAMAKA26-GATEPASS|REF:${record.reference_code}|GUEST:${encodeURIComponent(record.full_name)}|SEATS:${seats}|TABLE:${encodeURIComponent(tableAssignment)}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 1,
      color: {
        dark: '#0E1B2E',
        light: '#FFFFFF',
      },
    });

    const qrImg = new Image();
    await new Promise<void>((resolve, reject) => {
      qrImg.onload = () => resolve();
      qrImg.onerror = () => reject(new Error('Failed to load QR image'));
      qrImg.src = qrDataUrl;
    });

    // Draw QR Code Card
    const qrBoxW = 200;
    const qrBoxH = 200;
    const qrX = gridX + 60;
    const qrY = lowerY;

    // Background white pill for QR
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, qrX - 10, qrY - 10, qrBoxW + 20, qrBoxH + 20, 14);
    ctx.fill();
    ctx.drawImage(qrImg, qrX, qrY, qrBoxW, qrBoxH);

    ctx.textAlign = 'center';
    ctx.font = 'bold 11px "Montserrat", sans-serif';
    ctx.fillStyle = '#ECC880';
    ctx.fillText('SCAN FOR GATE VERIFICATION', qrX + qrBoxW / 2, qrY + qrBoxH + 28);
  } catch (err) {
    console.warn('QR code generation notice:', err);
  }

  // Draw Royal Wax Seal Illustration on the Right
  const sealCenterX = width - gridX - 150;
  const sealCenterY = lowerY + 100;
  const sealRadius = 80;

  // Seal outer ruffled shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 6;

  // Seal Crimson Body
  const sealGrad = ctx.createRadialGradient(sealCenterX - 15, sealCenterY - 15, 10, sealCenterX, sealCenterY, sealRadius);
  sealGrad.addColorStop(0, '#9E1925');
  sealGrad.addColorStop(0.7, '#6E0D16');
  sealGrad.addColorStop(1, '#4A080E');
  ctx.fillStyle = sealGrad;
  ctx.beginPath();
  ctx.arc(sealCenterX, sealCenterY, sealRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Seal inner gold embossed ring
  ctx.strokeStyle = '#D6B477';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(sealCenterX, sealCenterY, sealRadius - 16, 0, Math.PI * 2);
  ctx.stroke();

  // Seal text
  ctx.textAlign = 'center';
  ctx.font = 'bold 10px "Montserrat", sans-serif';
  ctx.fillStyle = '#ECC880';
  ctx.fillText('OFFICIAL PROTOCOL', sealCenterX, sealCenterY - 32);

  ctx.font = 'bold 30px "Cinzel", "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#ECC880';
  ctx.fillText('PU', sealCenterX, sealCenterY + 4);

  ctx.font = 'bold 10px "Montserrat", sans-serif';
  ctx.fillStyle = '#ECC880';
  ctx.fillText('CONFIRMED ENTRY', sealCenterX, sealCenterY + 36);

  // 8. Footer Security Admittance Disclaimer
  const footerY = height - 90;
  ctx.textAlign = 'center';
  ctx.font = '12px "Montserrat", sans-serif';
  ctx.fillStyle = '#A4C4DC';
  ctx.fillText('STRICTLY BY INVITATION · THIS DIGITAL PASS IS NON-TRANSFERABLE', width / 2, footerY);

  ctx.font = 'bold 11px "Montserrat", sans-serif';
  ctx.fillStyle = 'rgba(214, 180, 119, 0.7)';
  ctx.fillText('PLEASE PRESENT THIS DIGITAL PASS OR REFERENCE CODE AT THE VENUE ENTRANCE', width / 2, footerY + 22);

  return canvas;
}

/**
 * Renders the invitation card canvas to a pristine JPEG Data URL
 */
export async function generateInvitationCardJPEG(record: RSVPRecord): Promise<string> {
  const canvas = await generateInvitationCardCanvas(record);
  return canvas.toDataURL('image/jpeg', 0.95);
}

/**
 * Downloads or shares the personalized JPEG invitation card onto the user's phone / device
 */
export async function downloadInvitationCardJPEG(record: RSVPRecord): Promise<{ success: boolean; dataUrl: string }> {
  const canvas = await generateInvitationCardCanvas(record);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const fileName = `Official_Wedding_Invitation_PU_${record.reference_code || 'PASS'}.jpeg`;

  // Try Native Mobile File Share (iOS Safari / Android Chrome "Save to Photos" sheet)
  if (typeof navigator !== 'undefined' && navigator.canShare) {
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.95));
      if (blob) {
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Precious & Ugochukwu Wedding Invitation (#UgoAmaka26)`,
            text: `Official Wedding Invitation & Security Pass for ${record.full_name} (${record.reference_code})`,
            files: [file],
          });
          return { success: true, dataUrl };
        }
      }
    } catch (err) {
      // User cancelled share or browser fallback
      console.warn('Native share dismissed or not supported, falling back to direct download:', err);
    }
  }

  // Standard Direct Download Fallback
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return { success: true, dataUrl };
}

/**
 * Helper to draw rounded rectangle
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
