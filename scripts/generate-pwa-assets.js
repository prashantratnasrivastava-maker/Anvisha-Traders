import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const svgPath = path.join(publicDir, 'icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  console.log('Generating PWA icons...');

  // 1. pwa-192x192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  // 2. pwa-512x512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // 3. apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // 4. Maskable 512x512 (with 15% safe-zone margin on solid brand background)
  const innerIcon = await sharp(svgBuffer)
    .resize(380, 380)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 87, b: 34, alpha: 1 }, // #ff5722 brand color
    },
  })
    .composite([{ input: innerIcon, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Created pwa-maskable-512x512.png');

  // 5. favicon.ico / favicon-32x32.png
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Created favicon.ico');

  // 6. Desktop Screenshot (1280x720) for PWABuilder & App Stores
  const desktopSvg = `
  <svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
    <rect width="1280" height="720" fill="#f8fafc"/>
    <!-- Top Nav -->
    <rect width="1280" height="64" fill="#ffffff"/>
    <rect x="0" y="63" width="1280" height="1" fill="#e2e8f0"/>
    <circle cx="48" cy="32" r="18" fill="#ff5722"/>
    <text x="76" y="38" font-family="sans-serif" font-weight="800" font-size="20" fill="#1e293b">ANVISHA TRADERS</text>
    <rect x="800" y="16" width="300" height="32" rx="16" fill="#f1f5f9"/>
    <text x="820" y="37" font-family="sans-serif" font-size="13" fill="#94a3b8">Search products, categories...</text>
    <rect x="1130" y="16" width="110" height="32" rx="8" fill="#ff5722"/>
    <text x="1185" y="37" font-family="sans-serif" font-weight="700" font-size="13" fill="#ffffff" text-anchor="middle">My Cart (3)</text>
    
    <!-- Hero / Category banner -->
    <rect x="60" y="90" width="1160" height="140" rx="16" fill="#ff5722"/>
    <text x="100" y="145" font-family="sans-serif" font-weight="900" font-size="32" fill="#ffffff">Premium Hardware, Electricals &amp; Household</text>
    <text x="100" y="180" font-family="sans-serif" font-weight="500" font-size="16" fill="#fed7aa">Direct Wholesale &amp; Retail Catalog • Siwan, Bihar</text>
    
    <!-- Product Grid preview -->
    <g transform="translate(60, 260)">
      ${[0, 1, 2, 3].map((i) => `
        <g transform="translate(${i * 300}, 0)">
          <rect width="270" height="380" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
          <rect x="15" y="15" width="240" height="200" rx="12" fill="#f1f5f9"/>
          <circle cx="135" cy="115" r="40" fill="#fdba74"/>
          <text x="25" y="245" font-family="sans-serif" font-weight="700" font-size="16" fill="#0f172a">Premium Item #${i + 1}</text>
          <text x="25" y="270" font-family="sans-serif" font-size="13" fill="#64748b">Direct Stock • Verified Unit</text>
          <rect x="25" y="320" width="220" height="40" rx="8" fill="#ff5722"/>
          <text x="135" y="345" font-family="sans-serif" font-weight="700" font-size="14" fill="#ffffff" text-anchor="middle">View Details / Add</text>
        </g>
      `).join('')}
    </g>
  </svg>`;

  await sharp(Buffer.from(desktopSvg))
    .resize(1280, 720)
    .png()
    .toFile(path.join(publicDir, 'screenshot-desktop.png'));
  console.log('Created screenshot-desktop.png');

  // 7. Mobile Screenshot (750x1334)
  const mobileSvg = `
  <svg width="750" height="1334" viewBox="0 0 750 1334" xmlns="http://www.w3.org/2000/svg">
    <rect width="750" height="1334" fill="#f8fafc"/>
    <!-- Status bar & header -->
    <rect width="750" height="110" fill="#ffffff"/>
    <circle cx="60" cy="55" r="24" fill="#ff5722"/>
    <text x="96" y="63" font-family="sans-serif" font-weight="800" font-size="24" fill="#1e293b">Anvisha Traders</text>
    <rect x="40" y="130" width="670" height="160" rx="20" fill="#ff5722"/>
    <text x="70" y="195" font-family="sans-serif" font-weight="900" font-size="30" fill="#ffffff">Smart Store &amp; Orders</text>
    <text x="70" y="235" font-family="sans-serif" font-size="18" fill="#fed7aa">Direct Catalog &amp; Tracking</text>
    
    <!-- Product list -->
    <g transform="translate(40, 320)">
      ${[0, 1, 2].map((i) => `
        <g transform="translate(0, ${i * 280})">
          <rect width="670" height="250" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
          <rect x="20" y="25" width="200" height="200" rx="16" fill="#f1f5f9"/>
          <circle cx="120" cy="125" r="45" fill="#fdba74"/>
          <text x="245" y="70" font-family="sans-serif" font-weight="800" font-size="22" fill="#0f172a">Verified Store Item #${i + 1}</text>
          <text x="245" y="105" font-family="sans-serif" font-size="16" fill="#64748b">Quality Assurance • Siwan</text>
          <rect x="245" y="160" width="180" height="48" rx="10" fill="#ff5722"/>
          <text x="335" y="190" font-family="sans-serif" font-weight="700" font-size="17" fill="#ffffff" text-anchor="middle">Order Item</text>
        </g>
      `).join('')}
    </g>
  </svg>`;

  await sharp(Buffer.from(mobileSvg))
    .resize(750, 1334)
    .png()
    .toFile(path.join(publicDir, 'screenshot-mobile.png'));
  console.log('Created screenshot-mobile.png');

  console.log('All assets generated successfully!');
}

generate().catch(console.error);
