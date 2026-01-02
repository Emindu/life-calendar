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

      const dpr = 3;
      const baseWidth = 1170;
      const baseHeight = 2532;

      canvas.width = baseWidth * dpr;
      canvas.height = baseHeight * dpr;
      ctx.scale(dpr, dpr);

      // Clear the canvas
      ctx.clearRect(0, 0, baseWidth, baseHeight);

      const currentTheme = themes[theme];

      ctx.fillStyle = currentTheme.background(ctx, baseWidth, baseHeight);
      ctx.fillRect(0, 0, baseWidth, baseHeight);

      // Slightly smaller for better vertical fit
      const dotRadius = 12; 
      const spacing = 14;
      const totalColumns = 20;

      const gridWidth = totalColumns * (dotRadius * 2) + (totalColumns - 1) * spacing;
      const totalRows = Math.ceil(daysInYear / totalColumns);
      const gridHeight = totalRows * (dotRadius * 2) + (totalRows - 1) * spacing;

      // Pushed down to avoid clock (y: 1000 is safe below date/time)
      const safeAreaPaddingTop = 1000;
      const safeAreaPaddingBottom = 400;
      const drawableHeight = baseHeight - safeAreaPaddingTop - safeAreaPaddingBottom;

      const titleHeight = 50;
      const subtitleHeight = 40;
      const paddingBetweenTitleAndGrid = 80;
      const paddingBetweenGridAndSubtitle = 80;

      const totalContentHeight = titleHeight + paddingBetweenTitleAndGrid + gridHeight + paddingBetweenGridAndSubtitle + subtitleHeight;
      const contentStartY = Math.round(safeAreaPaddingTop + (drawableHeight - totalContentHeight) / 2);

      const titleY = contentStartY;
      const gridStartY = titleY + titleHeight + paddingBetweenTitleAndGrid;
      const subtitleY = gridStartY + gridHeight + paddingBetweenGridAndSubtitle;
      
      // Force integer rounding for perfect centering
      const gridStartX = Math.round((baseWidth - gridWidth) / 2);

      ctx.fillStyle = currentTheme.text;
      ctx.globalAlpha = 0.8;
      const titleFont = theme === 'eink' ? 'bold 52px monospace' : '700 52px "Inter", sans-serif';
      ctx.font = titleFont;
      ctx.textAlign = 'center';
      ctx.fillText('This Year in Days', Math.round(baseWidth / 2), Math.round(titleY));

      for (let i = 0; i < daysInYear; i++) {
        const row = Math.floor(i / totalColumns);
        const col = i % totalColumns;

        const x = gridStartX + col * (dotRadius * 2 + spacing) + dotRadius;
        const y = gridStartY + row * (dotRadius * 2 + spacing) + dotRadius;

        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);

        if (i < dayOfYear) {
          if (currentTheme.lived.shadow) {
            ctx.shadowColor = currentTheme.lived.color;
            ctx.shadowBlur = 12;
          }
          ctx.fillStyle = currentTheme.lived.color;
          ctx.fill();
        } else {
          ctx.shadowBlur = 0;
          if ((currentTheme as any).futureOutline) {
            ctx.strokeStyle = (currentTheme as any).futureOutline;
            ctx.lineWidth = 1;
            ctx.stroke();
          } else {
            ctx.fillStyle = currentTheme.future.color;
            ctx.fill();
          }
        }
      }

      ctx.shadowBlur = 0;

      ctx.fillStyle = currentTheme.text;
      ctx.globalAlpha = 0.7;
      const subtitleFont = theme === 'eink' ? '38px monospace' : '500 38px "Inter", sans-serif';
      ctx.font = subtitleFont;
      ctx.textAlign = 'center';
      ctx.fillText(`Day ${dayOfYear} of ${daysInYear}`, Math.round(baseWidth / 2), Math.round(subtitleY));
      ctx.globalAlpha = 1.0;

      if (autoDownload) {
        setTimeout(handleDownload, 500);
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

      <p className="text-slate-500 mb-4 text-sm">A high-resolution image will be generated for download.</p>
      <div className="flex justify-center mb-6 bg-slate-100 p-2 rounded-lg">
        <canvas ref={canvasRef} style={{ width: '50%', borderRadius: '8px' }} />
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