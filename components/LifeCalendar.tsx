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

const WeekBox: React.FC<{ lived: boolean; isCurrent: boolean; year: number; week: number }> = React.memo(({ lived, isCurrent, year, week }) => {
  let boxStyle = 'bg-slate-200 hover:bg-slate-400 hover:scale-125 z-10';
  
  if (isCurrent) {
    boxStyle = 'bg-red-500 shadow-sm shadow-red-500/50 hover:bg-red-600 hover:scale-125 z-20';
  } else if (lived) {
    boxStyle = 'bg-slate-700';
  }

  return (
    <div
      className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-sm transition-all duration-200 cursor-crosshair ${boxStyle}`}
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
    <div className="flex flex-col items-center w-full max-w-fit mx-auto overflow-hidden">
      {/* Custom Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 px-2 py-1 text-[10px] sm:text-xs font-semibold text-white bg-slate-900 rounded shadow-xl pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(10px, -25px)',
            whiteSpace: 'nowrap',
          }}
        >
          {tooltip.content}
        </div>
      )}

      <div
        className="grid gap-px bg-slate-50 p-1 rounded-sm"
        style={{ gridTemplateColumns: 'repeat(52, minmax(0, 1fr))' }}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {Array.from({ length: totalWeeks }).map((_, i) => {
          const year = Math.floor(i / 52);
          const week = i % 52;
          // The last lived week is index (weeksLived - 1)
          const isCurrent = i === weeksLived - 1;
          
          return (
            <WeekBox
              key={i}
              lived={i < weeksLived}
              isCurrent={isCurrent}
              year={year}
              week={week}
            />
          );
        })}
      </div>
      <div className="w-full flex justify-between text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider px-0.5">
          <span>Birth</span>
          <span>Age {lifespan}</span>
      </div>
    </div>
  );
};

export default LifeCalendar;