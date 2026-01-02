import React, { useRef, useEffect, useState } from 'react';

interface DayProgressWallpaperGeneratorProps {
  dayOfYear: number;
  daysInYear: number;
  initialTheme?: ThemeKey;
  autoDownload?: boolean;
}

const themes = {
  sunset: {
    name: 'Sunset',
    background: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#FF8C42');
      gradient.addColorStop(0.5, '#D8576B');
      gradient.addColorStop(1, '#5C2E7E');
      return gradient;
    },
    lived: { color: '#FFF5E1', shadow: true },
    future: { color: 'rgba(0, 0, 0, 0.25)' },
    text: '#FFFFFF',
  },
  forest: {
    name: 'Forest',
    background: () => '#2C3E50',
    lived: { color: '#2ECC71', shadow: false },
    future: { color: '#3E5368' },
    text: '#ECF0F1',
  },
  ocean: {
    name: 'Ocean',
    background: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#0F2027');
      gradient.addColorStop(0.5, '#203A43');
      gradient.addColorStop(1, '#2C5364');
      return gradient;
    },
    lived: { color: '#00C9FF', shadow: true },
    future: { color: 'rgba(255, 255, 255, 0.1)' },
    text: '#E0E0E0',
  },
  monochrome: {
    name: 'Monochrome',
    background: () => '#111111',
    lived: { color: '#FFFFFF', shadow: false },
    future: { color: '#444444' },
    text: '#FFFFFF',
  },
  eink: {
    name: 'E-ink',
    background: () => '#FFFFFF',
    lived: { color: '#000000', shadow: false },
    future: { color: '#FFFFFF' },
    futureOutline: '#000000',
    text: '#000000',
  },
};

type ThemeKey = keyof typeof themes;

const DayProgressWallpaperGenerator: React.FC<DayProgressWallpaperGeneratorProps> = ({ 
  dayOfYear, 
  daysInYear, 
  initialTheme = 'ocean',
  autoDownload = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theme, setTheme] = useState<ThemeKey>(initialTheme);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `day-progress-wallpaper-${theme}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  useEffect(() => {
    const drawCanvas = async () => {
      await document.fonts.ready;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Logical dimensions for iPhone 12/13/14/15 (390x844)
      const baseWidth = 390;
      const baseHeight = 844;
      const dpr = 3; // Exports 1170 x 2532

      canvas.width = baseWidth * dpr;
      canvas.height = baseHeight * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, baseWidth, baseHeight);

      const currentTheme = themes[theme];
      ctx.fillStyle = currentTheme.background(ctx, baseWidth, baseHeight);
      ctx.fillRect(0, 0, baseWidth, baseHeight);

      // Centering Math: totalColumns * 2r + (totalColumns - 1) * spacing
      // 20 * 8 + 19 * 6 = 160 + 114 = 274 (Even number!)
      const dotRadius = 4; 
      const spacing = 6;
      const totalColumns = 20;

      const gridWidth = totalColumns * (dotRadius * 2) + (totalColumns - 1) * spacing;
      const totalRows = Math.ceil(daysInYear / totalColumns);
      const gridHeight = totalRows * (dotRadius * 2) + (totalRows - 1) * spacing;

      // Vertical position pushed down to clear clock (~350 is safe)
      const safeAreaTop = 350;
      const titleY = safeAreaTop;
      const gridStartY = titleY + 40; // Title font size is 18, 40px gap
      const subtitleY = gridStartY + gridHeight + 40;
      
      // gridStartX = (390 - 274) / 2 = 58 (Perfect integer)
      const gridStartX = Math.floor((baseWidth - gridWidth) / 2);

      ctx.fillStyle = currentTheme.text;
      ctx.textAlign = 'center';
      
      // Title
      ctx.globalAlpha = 0.8;
      const titleSize = 18;
      ctx.font = theme === 'eink' ? `bold ${titleSize}px monospace` : `700 ${titleSize}px "Inter", sans-serif`;
      ctx.fillText('This Year in Days', Math.round(baseWidth / 2), Math.round(titleY));

      // Grid
      for (let i = 0; i < daysInYear; i++) {
        const row = Math.floor(i / totalColumns);
        const col = i % totalColumns;

        const x = gridStartX + col * (dotRadius * 2 + spacing) + dotRadius;
        const y = gridStartY + row * (dotRadius * 2 + spacing) + dotRadius;

        ctx.beginPath();
        ctx.arc(Math.round(x), Math.round(y), dotRadius, 0, 2 * Math.PI);

        if (i < dayOfYear) {
          if (currentTheme.lived.shadow) {
            ctx.shadowColor = currentTheme.lived.color;
            ctx.shadowBlur = 4;
          }
          ctx.fillStyle = currentTheme.lived.color;
          ctx.fill();
        } else {
          ctx.shadowBlur = 0;
          if ((currentTheme as any).futureOutline) {
            ctx.strokeStyle = (currentTheme as any).futureOutline;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          } else {
            ctx.fillStyle = currentTheme.future.color;
            ctx.fill();
          }
        }
      }

      ctx.shadowBlur = 0;

      // Subtitle
      ctx.fillStyle = currentTheme.text;
      ctx.globalAlpha = 0.7;
      const subSize = 13;
      ctx.font = theme === 'eink' ? `${subSize}px monospace` : `500 ${subSize}px "Inter", sans-serif`;
      ctx.fillText(`Day ${dayOfYear} of ${daysInYear}`, Math.round(baseWidth / 2), Math.round(subtitleY));
      ctx.globalAlpha = 1.0;

      if (autoDownload) {
        setTimeout(handleDownload, 1000);
      }
    };

    drawCanvas();
  }, [dayOfYear, daysInYear, theme, autoDownload]);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Day Progress Wallpaper</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-600 mb-2">Theme</label>
        <div className="flex flex-wrap justify-center gap-2">
            {(Object.keys(themes) as ThemeKey[]).map((key) => (
                <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        theme === key
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                >
                    {themes[key].name}
                </button>
            ))}
        </div>
      </div>

      <p className="text-slate-500 mb-4 text-sm">Corrected for iPhone 12 centering and clock clearance.</p>
      <div className="flex justify-center mb-6 bg-slate-100 p-2 rounded-lg">
        <canvas ref={canvasRef} style={{ width: '200px', borderRadius: '8px', border: '1px solid #ddd' }} />
      </div>
      <button
        onClick={handleDownload}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full"
      >
        Download Wallpaper
      </button>
    </div>
  );
};

export default DayProgressWallpaperGenerator;