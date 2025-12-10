import React from 'react';
import { FinanceItem, Currency, FREQUENCY_MULTIPLIERS } from '../types';
import { Icon } from './Icon';

interface FinanceCardProps {
  item: FinanceItem;
  currency: Currency;
  familyMembers: number;
  onDelete: (id: string) => void;
  onEdit: (item: FinanceItem) => void;
}

export const FinanceCard: React.FC<FinanceCardProps> = ({ item, currency, familyMembers, onDelete, onEdit }) => {
  const isAsset = item.type === 'asset';
  
  // Calculate effective monthly amount
  let effectiveAmount = item.amount * FREQUENCY_MULTIPLIERS[item.frequency];
  if (item.isPerPerson && item.type === 'liability') {
    effectiveAmount *= familyMembers;
  }

  const freqLabel = item.frequency === 'day' ? '/день' : item.frequency === 'week' ? '/тиж' : '/міс';

  return (
    <div className={`
      relative group flex items-center justify-between p-4 mb-3 rounded-none border transition-all duration-300
      bg-surface hover:bg-[#1a1a1a]
      ${isAsset 
        ? 'border-l-4 border-l-neon-green border-y-0 border-r-0 hover:shadow-neon-green/20' 
        : 'border-l-4 border-l-neon-red border-y-0 border-r-0 hover:shadow-neon-red/20'
      }
    `}>
      <div className="flex items-center gap-4 overflow-hidden">
        <div className={`
          p-2 rounded-none border
          ${isAsset ? 'border-neon-green text-neon-green shadow-[0_0_5px_rgba(57,255,20,0.4)]' : 'border-neon-red text-neon-red shadow-[0_0_5px_rgba(255,0,60,0.4)]'}
        `}>
          <Icon name={item.icon || 'Circle'} size={20} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-white truncate tracking-wide">{item.name}</span>
          <div className="text-xs text-gray-400 flex items-center gap-1 font-mono">
            <span>{item.amount.toLocaleString()} {currency} {freqLabel}</span>
            {item.isPerPerson && (
              <span className="text-[10px] ml-1 px-1 border border-gray-600 rounded-sm">x{familyMembers}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0 ml-2">
        <span className={`font-mono font-bold text-lg drop-shadow-md ${isAsset ? 'text-neon-green' : 'text-neon-red'}`}>
          {effectiveAmount.toLocaleString()} {currency}
        </span>
        <span className="text-[10px] uppercase text-gray-500 tracking-widest">в місяць</span>
      </div>

      {/* Quick Actions */}
      <div className="absolute right-0 top-0 h-full w-20 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-black to-transparent flex items-center justify-end pr-2 gap-3">
        <button 
          onClick={() => onEdit(item)}
          className="text-white hover:text-neon-blue transition-colors"
        >
          <Icon name="Edit2" size={16} />
        </button>
        <button 
          onClick={() => onDelete(item.id)}
          className="text-white hover:text-neon-red transition-colors"
        >
          <Icon name="Trash2" size={16} />
        </button>
      </div>
    </div>
  );
};