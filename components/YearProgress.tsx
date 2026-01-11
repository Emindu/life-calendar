import React from 'react';

interface YearProgressProps {
  weekOfYear: number;
}

const YearProgress: React.FC<YearProgressProps> = ({ weekOfYear }) => {
  return (
    <div className="flex flex-col justify-start">
      <div className="grid grid-cols-52 gap-1 mb-1">
        {Array.from({ length: 52 }).map((_, i) => {
          const isCurrent = i === weekOfYear - 1;
          let className = 'h-3 rounded-sm ';
          
          if (isCurrent) {
            className += 'bg-red-500';
          } else if (i < weekOfYear) {
            className += 'bg-slate-700';
          } else {
            className += 'bg-slate-200';
          }

          return (
            <div
              key={i}
              className={className}
              title={`Week ${i + 1}`}
            />
          );
        })}
      </div>
      <p className="text-center text-[10px] text-slate-600 font-medium">
        Week {weekOfYear} of 52
      </p>
    </div>
  );
};

export default YearProgress;