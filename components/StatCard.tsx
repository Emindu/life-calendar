import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between items-baseline border-b border-slate-200 py-2 last:border-b-0">
      <span className="text-slate-600">{label}</span>
      <span className="text-lg font-semibold text-slate-800">{value}</span>
    </div>
  );
};

export default StatCard;