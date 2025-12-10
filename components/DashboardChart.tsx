import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Currency } from '../types';

interface DashboardChartProps {
  totalAssets: number;
  totalLiabilities: number;
  currency: Currency;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({ totalAssets, totalLiabilities, currency }) => {
  const data = [
    { name: 'Активи', value: totalAssets, color: '#39ff14' },
    { name: 'Пасиви', value: totalLiabilities, color: '#ff003c' },
  ].filter(d => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-600 border border-gray-800 bg-surface/50 rounded-none border-dashed">
        <p className="font-mono text-sm uppercase tracking-widest">NO DATA</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full bg-surface border border-gray-800 rounded-none p-4 shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                style={{ filter: `drop-shadow(0 0 4px ${entry.color})` }}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value.toLocaleString()} ${currency}`, '']}
            contentStyle={{ 
              backgroundColor: '#000', 
              borderColor: '#333',
              color: '#fff',
              fontFamily: 'monospace',
              borderRadius: '0px'
            }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="square"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};