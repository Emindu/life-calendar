import React, { useRef, useEffect, useState } from 'react';

interface WallpaperGeneratorProps {
  weeksLived: number;
  lifespan: number;
}

const themes = {
  nebula: {
    name: 'Nebula',
    background: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#2c3e50');
      gradient.addColorStop(1, '#000000');
      return gradient;
    },
    lived: { color: '#e74c3c', shadow: true },
    future: { color: 'rgba(255, 255, 255, 0.1)' },
    text: '#ecf0f1',
  },
  dune: {
    name: 'Dune',
    background: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#f39c12');
      gradient.addColorStop(1, '#d35400');
      return gradient;
    },
    lived: { color: '#2c3e50', shadow: false },
    future: { color: 'rgba(255, 255, 255, 0.3)' },
    text: '#2c3e50',
  },
  matrix: {
    name: 'Matrix',
    background: () => '#000000',
    lived: { color: '#00FF41', shadow: true },
    future: { color: '#1A4314' },
    text: '#00FF41',
  },
  classic: {
    name: 'Classic',
    background: () => '#F5F5F5',
    lived: { color: '#333333', shadow: false },
    future: { color: '#E0E0E0' },
    text: '#333333',
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

const WallpaperGenerator: React.FC<WallpaperGeneratorProps> = ({ weeksLived, lifespan }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theme, setTheme] = useState<ThemeKey>('classic');

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

      const currentTheme = themes[theme];

      ctx.fillStyle = currentTheme.background(ctx, baseWidth, baseHeight);
      ctx.fillRect(0, 0, baseWidth, baseHeight);

      const pillWidth = 14;
      const pillHeight = 9;
      const spacing = 4;
      const totalColumns = 52;
      const totalRows = lifespan > 0 ? lifespan : 1;

      const gridWidth = totalColumns * pillWidth + (totalColumns - 1) * spacing;
      const gridHeight = totalRows * pillHeight + (totalRows - 1) * spacing;

      const safeAreaPaddingTop = 800;
      const safeAreaPaddingBottom = 450;
      const drawableHeight = baseHeight - safeAreaPaddingTop - safeAreaPaddingBottom;

      const totalWeeks = lifespan * 52;
      const weeksRemaining = totalWeeks > weeksLived ? totalWeeks - weeksLived : 0;

      const statsHeight = 40;
      const titleHeight = 50;
      const paddingBetweenStatsAndGrid = 50;
      const paddingBetweenGridAndTitle = 70;

      const totalContentHeight = statsHeight + paddingBetweenStatsAndGrid + gridHeight + paddingBetweenGridAndTitle + titleHeight;
      const contentStartY = safeAreaPaddingTop + (drawableHeight - totalContentHeight) / 2;

      const statsY = contentStartY;
      const gridStartY = statsY + statsHeight + paddingBetweenStatsAndGrid;
      const titleY = gridStartY + gridHeight + paddingBetweenGridAndTitle;
      const gridStartX = (baseWidth - gridWidth) / 2;

      for (let i = 0; i < totalRows * totalColumns; i++) {
        const row = Math.floor(i / totalColumns);
        const col = i % totalColumns;

        const x = gridStartX + col * (pillWidth + spacing);
        const y = gridStartY + row * (pillHeight + spacing);

        ctx.beginPath();
        ctx.roundRect(x, y, pillWidth, pillHeight, [pillHeight / 2]);

        if (i < weeksLived) {
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
      const statsFont = theme === 'eink' ? '36px monospace' : '500 36px "Inter", sans-serif';
      ctx.font = statsFont;
      
      ctx.textAlign = 'left';
      ctx.fillText(`Lived: ${weeksLived.toLocaleString()}`, gridStartX, Math.round(statsY));
      
      ctx.textAlign = 'right';
      ctx.fillText(`Remaining: ${weeksRemaining.toLocaleString()}`, gridStartX + gridWidth, Math.round(statsY));

      ctx.globalAlpha = 0.8;
      const titleFont = theme === 'eink' ? 'bold 48px monospace' : '700 48px "Inter", sans-serif';
      ctx.font = titleFont;
      ctx.textAlign = 'center';
      ctx.fillText('Life Calendar', baseWidth / 2, Math.round(titleY));
      ctx.globalAlpha = 1.0;
    };

    drawCanvas();
  }, [weeksLived, lifespan, theme]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `life-calendar-wallpaper-${theme}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Life Calendar Wallpaper</h2>
      
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

export default WallpaperGenerator;
