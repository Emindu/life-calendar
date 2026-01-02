import React from 'react';

interface YearProgressProps {
  weekOfYear: number;
}

const YearProgress: React.FC<YearProgressProps> = ({ weekOfYear }) => {
  return (
    <div className="flex flex-col justify-start">
      <div className="grid grid-cols-52 gap-1 mb-2">
        {Array.from({ length: 52 }).map((_, i) => (
          <div
            key={i}
            className={`h-4 rounded-sm ${i < weekOfYear ? 'bg-slate-700' : 'bg-slate-200'}`}
            title={`Week ${i + 1}`}
          />
        ))}
      </div>
      <p className="text-center text-sm text-slate-600">
        Week {weekOfYear} of 52
      </p>
    </div>
  );
};

export default YearProgress;