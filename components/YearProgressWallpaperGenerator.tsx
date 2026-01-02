import React, { useRef, useEffect, useState } from 'react';

interface YearProgressWallpaperGeneratorProps {
  weekOfYear: number;
}

const themes = {
  synthwave: {
    name: 'Synthwave',
    background: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const gradient = ctx.createLinearGradient(0, h, w, 0);
      gradient.addColorStop(0, '#f72585');
      gradient.addColorStop(0.5, '#7209b7');
      gradient.addColorStop(1, '#3a0ca3');
      return gradient;
    },
    lived: { color: '#4cc9f0', shadow: true },
    future: { color: 'rgba(0, 0, 0, 0.25)' },
    text: '#FFFFFF',
  },
  graphite: {
    name: 'Graphite',
    background: () => '#2d3436',
    lived: { color: '#0984e3', shadow: false },
    future: { color: '#636e72' },
    text: '#dfe6e9',
  },
  latte: {
    name: 'Latte',
    background: () => '#EFEBE9',
    lived: { color: '#6D4C41', shadow: false },
    future: { color: '#BCAAA4' },
    text: '#4E342E',
  },
  sakura: {
    name: 'Sakura',
    background: () => '#FFFFFF',
    lived: { color: '#FFC0CB', shadow: true },
    future: { color: '#F0F0F0' },
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

const YearProgressWallpaperGenerator: React.FC<YearProgressWallpaperGeneratorProps> = ({ weekOfYear }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theme, setTheme] = useState<ThemeKey>('graphite');

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

      const pillWidth = 15;
      const pillHeight = 60;
      const spacing = 5;
      const totalColumns = 52;

      const barWidth = totalColumns * pillWidth + (totalColumns - 1) * spacing;

      const safeAreaPaddingTop = 800;
      const safeAreaPaddingBottom = 450;
      const drawableHeight = baseHeight - safeAreaPaddingTop - safeAreaPaddingBottom;

      const titleHeight = 50;
      const subtitleHeight = 40;
      const barHeight = pillHeight;
      const paddingBetweenTitleAndBar = 60;
      const paddingBetweenBarAndSubtitle = 60;

      const totalContentHeight = titleHeight + paddingBetweenTitleAndBar + barHeight + paddingBetweenBarAndSubtitle + subtitleHeight;
      const contentStartY = safeAreaPaddingTop + (drawableHeight - totalContentHeight) / 2;

      const titleY = contentStartY;
      const barStartY = titleY + titleHeight + paddingBetweenTitleAndBar;
      const subtitleY = barStartY + barHeight + paddingBetweenBarAndSubtitle;
      const barStartX = (baseWidth - barWidth) / 2;

      ctx.fillStyle = currentTheme.text;

      ctx.globalAlpha = 0.8;
      const titleFont = theme === 'eink' ? 'bold 48px monospace' : '700 48px "Inter", sans-serif';
      ctx.font = titleFont;
      ctx.textAlign = 'center';
      ctx.fillText('Year in Weeks', baseWidth / 2, Math.round(titleY));

      for (let i = 0; i < totalColumns; i++) {
        const x = barStartX + i * (pillWidth + spacing);
        const y = barStartY;

        ctx.beginPath();
        ctx.roundRect(x, y, pillWidth, pillHeight, [pillWidth / 2]);

        if (i < weekOfYear) {
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
      const subtitleFont = theme === 'eink' ? '36px monospace' : '500 36px "Inter", sans-serif';
      ctx.font = subtitleFont;
      ctx.textAlign = 'center';
      ctx.fillText(`Week ${weekOfYear} of 52`, baseWidth / 2, Math.round(subtitleY));
      ctx.globalAlpha = 1.0;
    };

    drawCanvas();
  }, [weekOfYear, theme]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `year-progress-wallpaper-${theme}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Year Progress Wallpaper</h2>
      
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

export default YearProgressWallpaperGenerator;
