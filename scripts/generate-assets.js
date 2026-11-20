import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

console.log('Using browser binary:', CHROME_PATH);

function renderHtmlToPng(html, outputPath, width, height) {
  const tempHtmlPath = path.resolve(root, `temp_${Date.now()}_${width}x${height}.html`);
  fs.writeFileSync(tempHtmlPath, html, 'utf8');

  const args = [
    '--headless=new',
    `--screenshot=${outputPath}`,
    `--window-size=${width},${height}`,
    '--hide-scrollbars',
    '--default-background-color=00000000',
    `file://${tempHtmlPath}`
  ];

  const result = spawnSync(CHROME_PATH, args, { stdio: 'pipe' });
  if (result.error) {
    console.error('Error invoking chrome:', result.error);
  }
  
  try {
    fs.unlinkSync(tempHtmlPath);
  } catch {}

  if (fs.existsSync(outputPath)) {
    console.log(`[OK] Generated: ${outputPath} (${width}x${height})`);
  } else {
    console.error(`[FAIL] Could not generate: ${outputPath}`);
  }
}

// 1. Icon HTML Template
function getIconHtml(size, transparentBg = false) {
  const bg = transparentBg ? 'transparent' : '#0f172a';
  const keySize = Math.round(size * 0.78);
  const radius = Math.round(keySize * 0.24);
  const fontSize = Math.round(keySize * 0.58);
  const dotSize = Math.max(3, Math.round(keySize * 0.035));

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${size}px;
    height: ${size}px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${bg};
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Ethiopic", sans-serif;
  }
  .keycap {
    width: ${keySize}px;
    height: ${keySize}px;
    border-radius: ${radius}px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%);
    box-shadow: 0 ${Math.round(keySize * 0.08)}px ${Math.round(keySize * 0.2)}px rgba(0, 0, 0, 0.45),
                inset 0 2px 3px rgba(255, 255, 255, 0.4),
                inset 0 -${Math.round(keySize * 0.04)}px ${Math.round(keySize * 0.08)}px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  .glyph {
    color: #ffffff;
    font-size: ${fontSize}px;
    font-weight: 700;
    line-height: 1;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
    margin-top: -${Math.round(keySize * 0.04)}px;
  }
  .dots {
    position: absolute;
    bottom: ${Math.round(keySize * 0.12)}px;
    display: flex;
    gap: ${Math.round(dotSize * 1.6)}px;
  }
  .dot {
    width: ${dotSize}px;
    height: ${dotSize}px;
    border-radius: 50%;
    background: #93c5fd;
    opacity: 0.85;
  }
  .dot.active {
    background: #ffffff;
    opacity: 1;
  }
</style>
</head>
<body>
  <div class="keycap">
    <div class="glyph">&#4773;</div>
    <div class="dots">
      <div class="dot"></div>
      <div class="dot active"></div>
      <div class="dot"></div>
    </div>
  </div>
</body>
</html>`;
}

// 2. Splash Screen HTML Template
function getSplashHtml(width, height) {
  const iconBox = Math.round(width * 0.38);
  const radius = Math.round(iconBox * 0.24);
  const fontSize = Math.round(iconBox * 0.58);
  const dotSize = Math.max(4, Math.round(iconBox * 0.035));

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${width}px;
    height: ${height}px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background: radial-gradient(circle at 50% 30%, #1e293b 0%, #0f172a 60%, #090d16 100%);
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Ethiopic", sans-serif;
    color: #ffffff;
    padding: ${Math.round(height * 0.1)}px 0 ${Math.round(height * 0.06)}px 0;
  }
  .center-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${Math.round(height * 0.02)}px;
    margin-top: auto;
    margin-bottom: auto;
  }
  .keycap {
    width: ${iconBox}px;
    height: ${iconBox}px;
    border-radius: ${radius}px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%);
    box-shadow: 0 ${Math.round(iconBox * 0.12)}px ${Math.round(iconBox * 0.35)}px rgba(37, 99, 235, 0.4),
                inset 0 3px 5px rgba(255, 255, 255, 0.45),
                inset 0 -${Math.round(iconBox * 0.05)}px ${Math.round(iconBox * 0.1)}px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1.5px solid rgba(255, 255, 255, 0.25);
  }
  .glyph {
    color: #ffffff;
    font-size: ${fontSize}px;
    font-weight: 700;
    line-height: 1;
    text-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    margin-top: -${Math.round(iconBox * 0.04)}px;
  }
  .dots {
    position: absolute;
    bottom: ${Math.round(iconBox * 0.12)}px;
    display: flex;
    gap: ${Math.round(dotSize * 1.6)}px;
  }
  .dot {
    width: ${dotSize}px;
    height: ${dotSize}px;
    border-radius: 50%;
    background: #93c5fd;
    opacity: 0.85;
  }
  .dot.active {
    background: #ffffff;
    opacity: 1;
  }
  .brand-title {
    font-size: ${Math.round(width * 0.095)}px;
    font-weight: 800;
    letter-spacing: 2px;
    margin-top: ${Math.round(height * 0.015)}px;
    text-shadow: 0 4px 16px rgba(0,0,0,0.4);
  }
  .brand-sub {
    font-size: ${Math.round(width * 0.04)}px;
    font-weight: 500;
    color: #93c5fd;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .badge {
    margin-top: ${Math.round(height * 0.01)}px;
    background: rgba(59, 130, 246, 0.12);
    border: 1px solid rgba(96, 165, 250, 0.35);
    padding: ${Math.round(height * 0.008)}px ${Math.round(width * 0.04)}px;
    border-radius: 9999px;
    font-size: ${Math.round(width * 0.035)}px;
    color: #e2e8f0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .badge-latin { color: #60a5fa; font-weight: 600; }
  .badge-arrow { color: #94a3b8; }
  .badge-ethiopic { color: #34d399; font-weight: 700; }
  .footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .footer-text {
    font-size: ${Math.round(width * 0.032)}px;
    color: #64748b;
    font-weight: 500;
  }
</style>
</head>
<body>
  <div></div>
  <div class="center-content">
    <div class="keycap">
      <div class="glyph">&#4773;</div>
      <div class="dots">
        <div class="dot"></div>
        <div class="dot active"></div>
        <div class="dot"></div>
      </div>
    </div>
    <div class="brand-title">&#4773;&#4621;&#4941;&#5073;</div>
    <div class="brand-sub">Elfye Amharic Keyboard</div>
    <div class="badge">
      <span class="badge-latin">selam</span>
      <span class="badge-arrow">&rarr;</span>
      <span class="badge-ethiopic">&#5056;&#4629;&#4637;</span>
    </div>
  </div>
  <div class="footer">
    <div class="footer-text">&#128274; 100% On-Device &bull; Zero Network Access</div>
  </div>
</body>
</html>`;
}

// Generate all target files
console.log('--- Generating Web Assets ---');
renderHtmlToPng(getIconHtml(32, true), path.resolve(root, 'apps/web/public/favicon.png'), 32, 32);
renderHtmlToPng(getIconHtml(180, false), path.resolve(root, 'apps/web/public/apple-touch-icon.png'), 180, 180);
renderHtmlToPng(getIconHtml(192, false), path.resolve(root, 'apps/web/public/icon-192.png'), 192, 192);
renderHtmlToPng(getIconHtml(512, false), path.resolve(root, 'apps/web/public/icon-512.png'), 512, 512);

console.log('--- Generating Desktop Assets ---');
renderHtmlToPng(getIconHtml(512, false), path.resolve(root, 'apps/desktop/public/icon.png'), 512, 512);

console.log('--- Generating Mobile Assets ---');
renderHtmlToPng(getIconHtml(1024, false), path.resolve(root, 'apps/mobile/assets/icon.png'), 1024, 1024);
renderHtmlToPng(getIconHtml(1024, true), path.resolve(root, 'apps/mobile/assets/adaptive-icon.png'), 1024, 1024);
renderHtmlToPng(getIconHtml(48, true), path.resolve(root, 'apps/mobile/assets/favicon.png'), 48, 48);
renderHtmlToPng(getSplashHtml(1284, 2778), path.resolve(root, 'apps/mobile/assets/splash.png'), 1284, 2778);

console.log('Asset generation complete!');
