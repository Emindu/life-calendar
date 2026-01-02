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
        className="grid gap-0.5 sm:gap-1 mb-2"
        style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: daysInYear }).map((_, i) => {
          const lived = i < dayOfYear;
          const boxStyle = lived
            ? 'bg-slate-700'
            : 'bg-slate-200';
          return (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${boxStyle}`}
              title={`Day ${i + 1}`}
            />
          );
        })}
      </div>
      <p className="text-center text-sm text-slate-600">
        Day {dayOfYear} of {daysInYear}
      </p>
    </div>
  );
};

export default DayProgress;