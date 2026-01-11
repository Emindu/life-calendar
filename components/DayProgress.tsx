import React from 'react';

interface DayProgressProps {
  dayOfYear: number;
  daysInYear: number;
}

const DayProgress: React.FC<DayProgressProps> = ({ dayOfYear, daysInYear }) => {
  const COLUMNS = 25; 

  return (
    <div className="flex flex-col justify-start">
      <div 
        className="grid gap-0.5 mb-1"
        style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: daysInYear }).map((_, i) => {
          const lived = i < dayOfYear;
          const isCurrent = i === dayOfYear - 1;
          
          let boxStyle = 'bg-slate-200';
          if (isCurrent) {
            boxStyle = 'bg-red-500';
          } else if (lived) {
            boxStyle = 'bg-slate-700';
          }

          return (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${boxStyle}`}
              title={`Day ${i + 1}`}
            />
          );
        })}
      </div>
      <p className="text-center text-[10px] text-slate-600 font-medium">
        Day {dayOfYear} of {daysInYear}
      </p>
    </div>
  );
};

export default DayProgress;