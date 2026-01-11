import { createCanvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
// FIX: Import 'process' to get correct Node.js types and resolve errors with process.cwd() and process.exit().
import { process } from 'process';

// --- 1. Date Calculation Logic (Ported from useDateCalculations.ts) ---

const getDayOfYear = (date: Date): { dayOfYear: number; daysInYear: number } => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay) + 1;

    const year = date.getFullYear();
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const daysInYear = isLeapYear ? 366 : 365;

    return { dayOfYear, daysInYear };
};

// --- 2. Drawing Logic (Ported from DayProgressWallpaperGenerator.tsx) ---

const theme = {
    name: 'E-ink',
    background: '#FFFFFF',
    lived: { color: '#000000' },
    future: { color: '#FFFFFF' },
    futureOutline: '#000000',
    text: '#000000',
};

async function generateWallpaper() {
    console.log('Starting wallpaper generation...');

    const { dayOfYear, daysInYear } = getDayOfYear(new Date());

    // Logical dimensions for iPhone 12/13/14/15 (390x844)
    const baseWidth = 390;
    const baseHeight = 844;
    const dpr = 3; // Exports 1170 x 2532

    const canvas = createCanvas(baseWidth * dpr, baseHeight * dpr);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    // Grid layout calculations
    const dotRadius = 4;
    const spacing = 6;
    const totalColumns = 20;

    const gridWidth = totalColumns * (dotRadius * 2) + (totalColumns - 1) * spacing;
    const totalRows = Math.ceil(daysInYear / totalColumns);
    const gridHeight = totalRows * (dotRadius * 2) + (totalRows - 1) * spacing;

    const safeAreaTop = 350;
    const titleY = safeAreaTop;
    const gridStartY = titleY + 40;
    const subtitleY = gridStartY + gridHeight + 40;
    const gridStartX = Math.floor((baseWidth - gridWidth) / 2);

    ctx.fillStyle = theme.text;
    ctx.textAlign = 'center';

    // Title
    ctx.globalAlpha = 0.8;
    const titleSize = 18;
    // Use a system-safe monospace font. In a real-world scenario you might register a custom font.
    ctx.font = `bold ${titleSize}px monospace`; 
    ctx.fillText('This Year in Days', Math.round(baseWidth / 2), Math.round(titleY));

    // Grid of dots
    for (let i = 0; i < daysInYear; i++) {
        const row = Math.floor(i / totalColumns);
        const col = i % totalColumns;
        const x = gridStartX + col * (dotRadius * 2 + spacing) + dotRadius;
        const y = gridStartY + row * (dotRadius * 2 + spacing) + dotRadius;

        ctx.beginPath();
        ctx.arc(Math.round(x), Math.round(y), dotRadius, 0, 2 * Math.PI);

        if (i === dayOfYear - 1) {
            // Current Day (Red)
            ctx.fillStyle = '#EF4444';
            ctx.fill();
        } else if (i < dayOfYear) {
            ctx.fillStyle = theme.lived.color;
            ctx.fill();
        } else {
            ctx.strokeStyle = theme.futureOutline;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    // Subtitle
    ctx.fillStyle = theme.text;
    ctx.globalAlpha = 0.7;
    const subSize = 13;
    ctx.font = `${subSize}px monospace`;
    ctx.fillText(`Day ${dayOfYear} of ${daysInYear}`, Math.round(baseWidth / 2), Math.round(subtitleY));
    
    console.log('Drawing complete.');

    // --- 3. Save the image to a file ---
    const outputPath = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
        console.log(`Created output directory at: ${outputPath}`);
    }

    const filePath = path.join(outputPath, 'day-progress-eink.png');
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filePath, buffer);

    console.log(`✅ Wallpaper saved successfully to: ${filePath}`);
}

// --- 4. Run the function ---
generateWallpaper().catch(err => {
    console.error('Error generating wallpaper:', err);
    process.exit(1);
});