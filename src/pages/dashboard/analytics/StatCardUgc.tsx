import React, {} from 'react';

interface StatCardUgcProps {
  title: string;
  value: string | number;
}

const StatCardUgc: React.FC<StatCardUgcProps> = ({ title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-300">
    <p className="text-xs font-bold uppercase tracking-wider text-slate-700">{title}</p>
    <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
  </div>
);

export default StatCardUgc;
