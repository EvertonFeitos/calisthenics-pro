import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const outputDir = resolve(projectRoot, 'public/icons');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const colors = {
  top: [8, 8, 12],
  bottom: [18, 18, 32],
  accent: [79, 70, 229],
  accentLight: [129, 140, 248],
  border: [196, 204, 255],
  white: [255, 255, 255],
};

mkdirSync(outputDir, { recursive: true });

for (const size of sizes) {
  const png = new PNG({ width: size, height: size });

  paintBackground(png, size);

  const cardSize = Math.round(size * 0.58);
  const cardX = Math.round((size - cardSize) / 2);
  const cardY = Math.round((size - cardSize) / 2);
  const cardRadius = Math.max(8, Math.round(size * 0.12));
  const cardBorder = Math.max(2, Math.round(size * 0.018));

  fillRoundedRect(
    png,
    cardX,
    cardY,
    cardSize,
    cardSize,
    cardRadius,
    colors.accent[0],
    colors.accent[1],
    colors.accent[2],
    255
  );

  strokeRoundedRect(
    png,
    cardX,
    cardY,
    cardSize,
    cardSize,
    cardRadius,
    cardBorder,
    colors.accentLight[0],
    colors.accentLight[1],
    colors.accentLight[2],
    255
  );

  const innerSize = Math.round(cardSize * 0.42);
  const innerX = Math.round((size - innerSize) / 2);
  const innerY = Math.round((size - innerSize) / 2);
  const innerRadius = Math.max(4, Math.round(size * 0.05));
  const innerBorder = Math.max(2, Math.round(size * 0.028));

  strokeRoundedRect(
    png,
    innerX,
    innerY,
    innerSize,
    innerSize,
    innerRadius,
    innerBorder,
    colors.white[0],
    colors.white[1],
    colors.white[2],
    255
  );

  const dotRadius = Math.max(3, Math.round(size * 0.045));
  drawCircle(
    png,
    Math.round(size / 2),
    Math.round(size / 2),
    dotRadius,
    colors.white[0],
    colors.white[1],
    colors.white[2],
    255
  );

  const filename = resolve(outputDir, `icon-${size}x${size}.png`);
  writeFileSync(filename, PNG.sync.write(png));
}

function paintBackground(png, size) {
  const center = size / 2;
  const maxDistance = Math.sqrt(center * center * 2);

  for (let y = 0; y < size; y += 1) {
    const verticalMix = y / Math.max(1, size - 1);
    const base = mix(colors.top, colors.bottom, verticalMix);

    for (let x = 0; x < size; x += 1) {
      const dx = x - center;
      const dy = y - center;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const vignette = Math.min(0.22, (distance / maxDistance) * 0.22);

      setPixel(
        png,
        x,
        y,
        Math.round(base[0] * (1 - vignette)),
        Math.round(base[1] * (1 - vignette)),
        Math.round(base[2] * (1 - vignette)),
        255
      );
    }
  }
}

function fillRoundedRect(png, x, y, width, height, radius, r, g, b, a) {
  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) {
      if (isInsideRoundedRect(px, py, x, y, width, height, radius)) {
        setPixel(png, px, py, r, g, b, a);
      }
    }
  }
}

function strokeRoundedRect(png, x, y, width, height, radius, thickness, r, g, b, a) {
  const innerX = x + thickness;
  const innerY = y + thickness;
  const innerWidth = width - thickness * 2;
  const innerHeight = height - thickness * 2;
  const innerRadius = Math.max(0, radius - thickness);

  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) {
      const isOuter = isInsideRoundedRect(px, py, x, y, width, height, radius);
      const isInner =
        innerWidth > 0 &&
        innerHeight > 0 &&
        isInsideRoundedRect(px, py, innerX, innerY, innerWidth, innerHeight, innerRadius);

      if (isOuter && !isInner) {
        setPixel(png, px, py, r, g, b, a);
      }
    }
  }
}

function isInsideRoundedRect(px, py, x, y, width, height, radius) {
  const rx = x + radius;
  const ry = y + radius;
  const right = x + width - radius - 1;
  const bottom = y + height - radius - 1;

  if (px >= rx && px <= right) {
    return py >= y && py < y + height;
  }

  if (py >= ry && py <= bottom) {
    return px >= x && px < x + width;
  }

  const corners = [
    [rx, ry],
    [right, ry],
    [rx, bottom],
    [right, bottom],
  ];

  return corners.some(([cx, cy]) => {
    const dx = px - cx;
    const dy = py - cy;
    return dx * dx + dy * dy <= radius * radius;
  });
}

function drawCircle(png, cx, cy, radius, r, g, b, a) {
  for (let y = cy - radius; y <= cy + radius; y += 1) {
    for (let x = cx - radius; x <= cx + radius; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= radius * radius) {
        setPixel(png, x, y, r, g, b, a);
      }
    }
  }
}

function setPixel(png, x, y, r, g, b, a) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) {
    return;
  }
  const index = (png.width * y + x) << 2;
  png.data[index] = r;
  png.data[index + 1] = g;
  png.data[index + 2] = b;
  png.data[index + 3] = a;
}

function mix(from, to, amount) {
  return [
    from[0] + (to[0] - from[0]) * amount,
    from[1] + (to[1] - from[1]) * amount,
    from[2] + (to[2] - from[2]) * amount,
  ];
}
