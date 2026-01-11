import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between items-baseline border-b border-slate-100 py-1 last:border-b-0">
      <span className="text-slate-500 text-xs">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
};

export default StatCard;