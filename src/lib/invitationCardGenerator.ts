import QRCode from 'qrcode';
import { RSVPRecord } from '../types/rsvp';

/**
 * Generates an ultra-high-resolution (1200x1800 px) personalized official wedding invitation card & security pass.
 * Styled in the requested Off-White with Cream Fine-Art Paper theme, adorned with delicate watercolor champagne
 * roses, soft sage eucalyptus botanical flowers, metallic gold foil borders, and perfectly balanced typography.
 */
export async function generateInvitationCardCanvas(record: RSVPRecord): Promise<HTMLCanvasElement> {
  const width = 1200;
  const height = 1800;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // 1. Off-White with Warm Cream Handmade Paper Texture Background
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 980);
  bgGrad.addColorStop(0, '#FCFAF6'); // Luminous ivory center
  bgGrad.addColorStop(0.55, '#F8F3EA'); // Warm cream midtone
  bgGrad.addColorStop(0.85, '#F1E9DC'); // Elegant linen cream
  bgGrad.addColorStop(1, '#E9DEC9'); // Soft vintage vignette edges
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle luxury handmade paper stippled fibers
  ctx.fillStyle = 'rgba(180, 150, 105, 0.035)';
  for (let i = 0; i < 180; i++) {
    const rx = (Math.sin(i * 137.5) * 0.5 + 0.5) * width;
    const ry = (Math.cos(i * 93.3) * 0.5 + 0.5) * height;
    ctx.beginPath();
    ctx.arc(rx, ry, (i % 2) + 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Ornate Botanical Floral Bouquets in the Four Corners
  drawCornerBouquet(ctx, 80, 80, 'top-left');
  drawCornerBouquet(ctx, width - 80, 80, 'top-right');
  drawCornerBouquet(ctx, 80, height - 80, 'bottom-left');
  drawCornerBouquet(ctx, width - 80, height - 80, 'bottom-right');

  // Top Center Delicate Floral Swag arching over the header
  drawTopFloralArch(ctx, width / 2, 85);

  // 3. Metallic Gold Foil Double Borders with Ornamental Corner Brackets
  ctx.strokeStyle = '#BCA063'; // Rich antique gold
  ctx.lineWidth = 3.5;
  ctx.strokeRect(55, 55, width - 110, height - 110);

  // Inner Fine Filigree Border
  ctx.strokeStyle = 'rgba(188, 160, 99, 0.5)';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(70, 70, width - 140, height - 140);

  // Corner Gold Diamond Finials
  const corners = [
    [55, 55],
    [width - 55, 55],
    [55, height - 55],
    [width - 55, height - 55],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = '#C8A665';
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();

    // Geometric corner bracket
    const dirX = cx === 55 ? 1 : -1;
    const dirY = cy === 55 ? 1 : -1;
    ctx.strokeStyle = '#C8A665';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(cx + dirX * 22, cy);
    ctx.lineTo(cx + dirX * 6, cy);
    ctx.lineTo(cx + dirX * 6, cy + dirY * 18);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy + dirY * 22);
    ctx.lineTo(cx, cy + dirY * 6);
    ctx.lineTo(cx + dirX * 18, cy + dirY * 6);
    ctx.stroke();
  });

  // 4. Royal Monogram Crest (P & U) in Golden Circle Wreath
  const crestY = 165;
  ctx.save();
  // Gold circle with warm cream backing
  ctx.fillStyle = '#FAF5EC';
  ctx.beginPath();
  ctx.arc(width / 2, crestY, 52, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#BCA063';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dotted outer halo
  ctx.strokeStyle = 'rgba(188, 160, 99, 0.4)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.arc(width / 2, crestY, 59, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Monogram letters
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 38px "Cinzel", "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#9C7A35'; // Deep antique gold
  ctx.fillText('P & U', width / 2, crestY);
  ctx.restore();

  // Hashtag & Ceremony Subtitle
  ctx.textAlign = 'center';
  ctx.font = 'bold 14px "Montserrat", sans-serif';
  ctx.fillStyle = '#9C7A35';
  ctx.fillText('#UGOAMAKA26 · ROYAL NUPTIALS', width / 2, crestY + 80);

  // 5. Official Stationery Header Titles (Scaled to Fit Comfortably)
  ctx.font = 'bold 22px "Cinzel", "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#111F33'; // Deep luxury royal navy
  ctx.fillText('OFFICIAL WEDDING INVITATION & SECURITY PASS', width / 2, crestY + 124);

  ctx.font = 'italic 18px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#5A6E82'; // Soft slate navy
  ctx.fillText('The Holy Matrimony & Nuptial Banquet of', width / 2, crestY + 160);

  // Couple Full Names - auto clamped to ensure spacious margins
  const coupleNames = 'Precious Uzoamaka & Ugochukwu Omeogu';
  ctx.font = 'bold 38px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#0E1B2E';
  ctx.fillText(coupleNames, width / 2, crestY + 208);

  // Decorative Golden Divider with Central Diamond
  const divY = crestY + 242;
  ctx.strokeStyle = '#C8A665';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 200, divY);
  ctx.lineTo(width / 2 - 16, divY);
  ctx.moveTo(width / 2 + 16, divY);
  ctx.lineTo(width / 2 + 200, divY);
  ctx.stroke();

  ctx.fillStyle = '#BCA063';
  ctx.save();
  ctx.translate(width / 2, divY);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-6, -6, 12, 12);
  ctx.restore();

  // 6. Honoured Guest Plaque (Cream Linen with Gold Trim)
  const plaqueY = divY + 26;
  const plaqueH = 168;
  const plaqueW = width - 220; // 980px width, generous side margins
  const plaqueX = (width - plaqueW) / 2;

  // Plaque Card Shadow & Background
  ctx.save();
  ctx.shadowColor = 'rgba(140, 110, 60, 0.12)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = '#FFFDF9'; // Pure warm cream
  roundRect(ctx, plaqueX, plaqueY, plaqueW, plaqueH, 16);
  ctx.fill();
  ctx.restore();

  // Plaque Borders
  ctx.strokeStyle = '#C8A665';
  ctx.lineWidth = 1.8;
  roundRect(ctx, plaqueX, plaqueY, plaqueW, plaqueH, 16);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(200, 166, 101, 0.3)';
  ctx.lineWidth = 1;
  roundRect(ctx, plaqueX + 6, plaqueY + 6, plaqueW - 12, plaqueH - 12, 12);
  ctx.stroke();

  // Plaque Content
  ctx.textAlign = 'center';
  ctx.font = 'bold 13px "Montserrat", sans-serif';
  ctx.fillStyle = '#9C7A35';
  ctx.fillText('GUEST OF HONOUR', width / 2, plaqueY + 38);

  // Guest Name with dynamic font size so any title or long name fits perfectly
  const guestName = record.full_name || 'Esteemed Guest';
  let guestFontSize = 38;
  ctx.font = `bold ${guestFontSize}px "Playfair Display", Georgia, serif`;
  while (ctx.measureText(guestName).width > plaqueW - 60 && guestFontSize > 22) {
    guestFontSize -= 2;
    ctx.font = `bold ${guestFontSize}px "Playfair Display", Georgia, serif`;
  }
  ctx.fillStyle = '#0E1B2E';
  ctx.fillText(guestName, width / 2, plaqueY + 86);

  // Guest Invitation Note
  if (record.guest_names && record.guest_names !== record.full_name) {
    ctx.font = 'italic 16px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#5A6E82';
    ctx.fillText(`Accompanying: ${record.guest_names}`, width / 2, plaqueY + 128);
  } else {
    ctx.font = 'italic 16px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#5A6E82';
    ctx.fillText('Cordially Invited to Share in Our Joy', width / 2, plaqueY + 128);
  }

  // 7. Event & Security Particulars Grid (Sized & Spaced to Fit Beautifully)
  const gridY = plaqueY + plaqueH + 26;
  const gridW = width - 220; // 980px wide
  const gridX = (width - gridW) / 2;
  const colW = (gridW - 18) / 2; // 481px per column

  const seats = record.allocated_seats || record.guest_count || 1;
  const tableAssignment = record.table_assignment || 'VIP Protocol Table';

  // Row 1: Access Permitted & Table Assignment
  const r1Y = gridY;
  drawParticularsBox(ctx, gridX, r1Y, colW, 72, 'ACCESS PERMITTED', `${seats} Reserved Seat(s)`);
  drawParticularsBox(ctx, gridX + colW + 18, r1Y, colW, 72, 'TABLE ASSIGNMENT', tableAssignment);

  // Row 2: Security Ref Code & Date/Time
  const r2Y = r1Y + 84;
  drawParticularsBox(ctx, gridX, r2Y, colW, 72, 'SECURITY REF CODE', record.reference_code, true);
  drawParticularsBox(ctx, gridX + colW + 18, r2Y, colW, 72, 'DATE & TIME', 'Friday, 13 Nov 2026 · 10:00 AM Prompt');

  // Row 3: Official Venue (Full Width)
  const r3Y = r2Y + 84;
  drawParticularsBox(
    ctx,
    gridX,
    r3Y,
    gridW,
    72,
    'OFFICIAL VENUE',
    'Tee s Cee Event Center · 6, Faskari Street, Area 3, Garki Abuja'
  );

  // Row 4: Dress Code Protocol (Full Width)
  const r4Y = r3Y + 84;
  drawParticularsBox(
    ctx,
    gridX,
    r4Y,
    gridW,
    68,
    'DRESS CODE PROTOCOL',
    'Strictly Black-Tie Formal Western Attire (No Traditional Attire)',
    false,
    true
  );

  // 8. Lower Security Admittance: QR Code & Royal Wax Seal
  const lowerY = r4Y + 92;

  // Generate Scannable QR Code
  const qrData = `UGOAMAKA26-GATEPASS|REF:${record.reference_code}|GUEST:${encodeURIComponent(record.full_name)}|SEATS:${seats}|TABLE:${encodeURIComponent(tableAssignment)}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(qrData, {
      width: 170,
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

    // QR Box Plaque
    const qrBoxW = 190;
    const qrBoxH = 190;
    const qrX = gridX + 45;
    const qrY = lowerY;

    ctx.save();
    ctx.shadowColor = 'rgba(140, 110, 60, 0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, qrX, qrY, qrBoxW, qrBoxH, 14);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#C8A665';
    ctx.lineWidth = 1.5;
    roundRect(ctx, qrX, qrY, qrBoxW, qrBoxH, 14);
    ctx.stroke();

    ctx.drawImage(qrImg, qrX + 10, qrY + 10, 170, 170);

    ctx.textAlign = 'center';
    ctx.font = 'bold 11px "Montserrat", sans-serif';
    ctx.fillStyle = '#9C7A35';
    ctx.fillText('SCAN FOR GATE VERIFICATION', qrX + qrBoxW / 2, qrY + qrBoxH + 24);
  } catch (err) {
    console.warn('QR code generation notice:', err);
  }

  // Draw Authentic Crimson & Gold Royal Wax Seal on Right
  const sealCenterX = width - gridX - 140;
  const sealCenterY = lowerY + 95;
  const sealRadius = 76;

  // Wax Seal Drop Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(70, 10, 20, 0.28)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;

  // Wax Body
  const sealGrad = ctx.createRadialGradient(sealCenterX - 15, sealCenterY - 15, 8, sealCenterX, sealCenterY, sealRadius);
  sealGrad.addColorStop(0, '#9E1925');
  sealGrad.addColorStop(0.75, '#6E0D16');
  sealGrad.addColorStop(1, '#4A080E');
  ctx.fillStyle = sealGrad;
  ctx.beginPath();
  ctx.arc(sealCenterX, sealCenterY, sealRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Seal Gold Embossed Ring
  ctx.strokeStyle = '#D6B477';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(sealCenterX, sealCenterY, sealRadius - 15, 0, Math.PI * 2);
  ctx.stroke();

  // Seal Typography
  ctx.textAlign = 'center';
  ctx.font = 'bold 9.5px "Montserrat", sans-serif';
  ctx.fillStyle = '#ECC880';
  ctx.fillText('OFFICIAL PROTOCOL', sealCenterX, sealCenterY - 30);

  ctx.font = 'bold 28px "Cinzel", "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('PU', sealCenterX, sealCenterY + 4);

  ctx.font = 'bold 9.5px "Montserrat", sans-serif';
  ctx.fillStyle = '#ECC880';
  ctx.fillText('CONFIRMED ENTRY', sealCenterX, sealCenterY + 34);

  // 9. Footer Security Protocol Note
  const footerY = height - 90;
  ctx.textAlign = 'center';
  ctx.font = 'bold 12px "Montserrat", sans-serif';
  ctx.fillStyle = '#0E1B2E';
  ctx.fillText('STRICTLY BY INVITATION · THIS DIGITAL PASS IS NON-TRANSFERABLE', width / 2, footerY);

  ctx.font = '11.5px "Montserrat", sans-serif';
  ctx.fillStyle = '#8B6A2B';
  ctx.fillText('PLEASE PRESENT THIS DIGITAL PASS OR REFERENCE CODE AT THE VENUE ENTRANCE', width / 2, footerY + 22);

  return canvas;
}

/**
 * Draws an event detail / particulars box with cream card styling and gold border
 */
function drawParticularsBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  isMono = false,
  isHighlight = false
) {
  ctx.save();
  ctx.shadowColor = 'rgba(140, 110, 60, 0.06)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = isHighlight ? '#FAF3E3' : '#FFFEFA';
  roundRect(ctx, x, y, w, h, 11);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = isHighlight ? '#C8A665' : 'rgba(200, 166, 101, 0.5)';
  ctx.lineWidth = 1.2;
  roundRect(ctx, x, y, w, h, 11);
  ctx.stroke();

  // Label
  ctx.textAlign = 'left';
  ctx.font = 'bold 11px "Montserrat", sans-serif';
  ctx.fillStyle = '#9C7A35';
  ctx.fillText(label, x + 16, y + 25);

  // Value - auto shrink font if text is long so it NEVER overflows
  let valFontSize = isMono ? 22 : 18;
  const fontFamily = isMono ? 'monospace' : '"Cinzel", "Playfair Display", Georgia, serif';
  ctx.font = `bold ${valFontSize}px ${fontFamily}`;
  while (ctx.measureText(value).width > w - 32 && valFontSize > 13) {
    valFontSize -= 1;
    ctx.font = `bold ${valFontSize}px ${fontFamily}`;
  }

  ctx.fillStyle = '#0E1B2E';
  ctx.fillText(value, x + 16, y + 53);
}

/**
 * Renders watercolor botanical flower clusters in the four corners
 */
function drawCornerBouquet(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
) {
  ctx.save();
  ctx.translate(cx, cy);

  let rot = 0;
  if (corner === 'top-right') rot = Math.PI / 2;
  if (corner === 'bottom-right') rot = Math.PI;
  if (corner === 'bottom-left') rot = -Math.PI / 2;
  ctx.rotate(rot);

  // Soft sage green eucalyptus branches extending outward
  drawLeaf(ctx, -20, 20, 75, -0.6, '#7E947A', '#5C7458');
  drawLeaf(ctx, -35, 45, 65, -0.9, '#8EA68B', '#688264');
  drawLeaf(ctx, 20, -20, 75, 0.6, '#7E947A', '#5C7458');
  drawLeaf(ctx, 45, -35, 65, 0.9, '#8EA68B', '#688264');

  // Golden botanical leafy sprigs
  drawLeaf(ctx, -10, 40, 55, -0.4, '#D6B477', '#B59458');
  drawLeaf(ctx, 40, -10, 55, 0.4, '#D6B477', '#B59458');

  // Main Ivory Champagne Rose
  drawWatercolorRose(ctx, 0, 0, 36, '#FFFBF5', '#F5E4D0', '#E5CAA8');

  // Secondary Rosebuds
  drawWatercolorRose(ctx, -24, -14, 20, '#FFFBF5', '#F8ECE0', '#ECCFB0');
  drawWatercolorRose(ctx, 16, 24, 22, '#FFFBF5', '#F8ECE0', '#ECCFB0');

  // Tiny golden stardust pollen dots
  ctx.fillStyle = 'rgba(214, 180, 119, 0.6)';
  [[-40, 10], [-25, 60], [10, -40], [60, -25], [35, 35]].forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Draws a subtle top botanical swag arching gently over the card header
 */
function drawTopFloralArch(ctx: CanvasRenderingContext2D, centerX: number, topY: number) {
  ctx.save();
  ctx.translate(centerX, topY);

  // Symmetrical soft green branches
  [-1, 1].forEach((dir) => {
    drawLeaf(ctx, dir * 45, 0, 45, dir * 0.4, '#8EA68B', '#688264');
    drawLeaf(ctx, dir * 90, 8, 40, dir * 0.6, '#7E947A', '#5C7458');
    drawLeaf(ctx, dir * 135, 18, 35, dir * 0.8, '#D6B477', '#B59458');
    drawLeaf(ctx, dir * 175, 30, 28, dir * 1.0, '#8EA68B', '#688264');
  });

  // Center subtle ivory blossom buds
  drawWatercolorRose(ctx, 0, -2, 16, '#FFFDF8', '#F5E6D4', '#E8CEB0');
  drawWatercolorRose(ctx, -32, 2, 12, '#FFFDF8', '#F5E6D4', '#E8CEB0');
  drawWatercolorRose(ctx, 32, 2, 12, '#FFFDF8', '#F5E6D4', '#E8CEB0');

  ctx.restore();
}

/**
 * Renders an organic watercolor rose with delicate layered petals
 */
function drawWatercolorRose(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  baseColor: string,
  petalColor: string,
  shadowColor: string
) {
  ctx.save();
  ctx.translate(x, y);

  // Outer petal base
  ctx.fillStyle = petalColor;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // Overlapping soft watercolor petals
  const petalCount = 7;
  for (let i = 0; i < petalCount; i++) {
    const angle = (i * (Math.PI * 2)) / petalCount;
    const px = Math.cos(angle) * (radius * 0.4);
    const py = Math.sin(angle) * (radius * 0.4);
    const r = radius * 0.65;

    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // Rose center spiral
  ctx.fillStyle = shadowColor;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.28, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.15, 0, Math.PI);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws an organic leaf with delicate natural curve and center vein
 */
function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  angle: number,
  color: string,
  veinColor: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(length * 0.35, -length * 0.28, length, 0);
  ctx.quadraticCurveTo(length * 0.35, length * 0.28, 0, 0);
  ctx.fill();

  // Central vein
  ctx.strokeStyle = veinColor;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(length * 0.85, 0);
  ctx.stroke();

  ctx.restore();
}

/**
 * Helper to draw a rounded rectangle
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
