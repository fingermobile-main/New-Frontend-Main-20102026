import React, {} from 'react';

interface StatCardUgcProps {
  title: string;
  value: string | number;
}

const StatCardUgc: React.FC<StatCardUgcProps> = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <p className="text-sm font-medium text-slate-700">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default StatCardUgc;
