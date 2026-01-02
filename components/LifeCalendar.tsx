import React, { useState } from 'react';

interface LifeCalendarProps {
  weeksLived: number;
  lifespan: number;
}

interface TooltipState {
  visible: boolean;
  content: string;
  x: number;
  y: number;
}

const WeekBox: React.FC<{ lived: boolean; year: number; week: number }> = React.memo(({ lived, year, week }) => {
  const boxStyle = lived
    ? 'bg-slate-700'
    : 'bg-slate-200 hover:bg-slate-300';

  return (
    <div
      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${boxStyle}`}
      data-tooltip-content={`Year: ${year + 1}, Week: ${week + 1}`}
    />
  );
});

const LifeCalendar: React.FC<LifeCalendarProps> = ({ weeksLived, lifespan }) => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: '',
    x: 0,
    y: 0,
  });

  const totalWeeks = lifespan * 52;

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const tooltipContent = target.getAttribute('data-tooltip-content');
    
    if (tooltipContent) {
      setTooltip({
        visible: true,
        content: tooltipContent,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tooltip.visible) {
      setTooltip(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
      }));
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Custom Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-10 px-3 py-1.5 text-sm font-medium text-slate-800 bg-white border border-slate-200 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(15px, -30px)',
            whiteSpace: 'nowrap',
          }}
        >
          {tooltip.content}
        </div>
      )}

      <div
        className="grid gap-1 sm:gap-1.5"
        style={{ gridTemplateColumns: 'repeat(52, minmax(0, 1fr))' }}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {Array.from({ length: totalWeeks }).map((_, i) => {
          const year = Math.floor(i / 52);
          const week = i % 52;
          return (
            <WeekBox
              key={i}
              lived={i < weeksLived}
              year={year}
              week={week}
            />
          );
        })}
      </div>
      <div className="w-full flex justify-between text-xs text-slate-500 mt-2 px-1">
          <span>Age 0</span>
          <span>Age {lifespan}</span>
      </div>
    </div>
  );
};

export default LifeCalendar;