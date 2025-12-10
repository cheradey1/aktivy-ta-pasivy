import React, { useState, useEffect } from 'react';
import { FinanceItem, ItemType, Frequency, Settings } from '../types';
import { Icon } from './Icon';
import { ICONS_LIST, CATEGORY_SUGGESTIONS } from '../constants';

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: FinanceItem) => void;
  editItem?: FinanceItem;
  defaultType: ItemType;
  settings: Settings;
}

export const AddEditModal: React.FC<AddEditModalProps> = ({ isOpen, onClose, onSave, editItem, defaultType, settings }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('month');
  const [type, setType] = useState<ItemType>(defaultType);
  const [icon, setIcon] = useState('Circle');
  const [isPerPerson, setIsPerPerson] = useState(false);

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setAmount(editItem.amount.toString());
      setFrequency(editItem.frequency);
      setType(editItem.type);
      setIcon(editItem.icon || 'Circle');
      setIsPerPerson(editItem.isPerPerson || false);
    } else {
      setName('');
      setAmount('');
      setFrequency('month');
      setType(defaultType);
      setIcon(defaultType === 'asset' ? 'Wallet' : 'ShoppingBasket');
      setIsPerPerson(false);
    }
  }, [editItem, defaultType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    const newItem: FinanceItem = {
      id: editItem ? editItem.id : crypto.randomUUID(),
      name,
      amount: parseFloat(amount),
      frequency,
      type,
      icon,
      isPerPerson: type === 'liability' ? isPerPerson : false,
    };

    onSave(newItem);
    onClose();
  };

  const accentColor = type === 'asset' ? 'text-neon-green border-neon-green shadow-neon-green' : 'text-neon-red border-neon-red shadow-neon-red';
  const accentBg = type === 'asset' ? 'bg-neon-green' : 'bg-neon-red';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`bg-black border-2 ${type === 'asset' ? 'border-neon-green' : 'border-neon-red'} w-full max-w-md shadow-[0_0_30px_rgba(0,0,0,0.8)] p-6 max-h-[90vh] overflow-y-auto no-scrollbar`}>
        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
          <h2 className={`text-xl font-bold font-mono uppercase tracking-wider ${type === 'asset' ? 'text-neon-green' : 'text-neon-red'}`}>
            {editItem ? 'EDIT' : 'ADD'} {type === 'asset' ? 'ASSET' : 'LIABILITY'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <Icon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType('asset')}
              className={`py-3 text-xs font-bold uppercase tracking-widest border transition-all ${
                type === 'asset' 
                  ? 'border-neon-green bg-neon-green text-black' 
                  : 'border-gray-800 text-gray-500 hover:border-gray-600'
              }`}
            >
              Assets
            </button>
            <button
              type="button"
              onClick={() => setType('liability')}
              className={`py-3 text-xs font-bold uppercase tracking-widest border transition-all ${
                type === 'liability' 
                  ? 'border-neon-red bg-neon-red text-black' 
                  : 'border-gray-800 text-gray-500 hover:border-gray-600'
              }`}
            >
              Liabilities
            </button>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2">
            {CATEGORY_SUGGESTIONS[type].slice(0, 4).map(sugg => (
              <button
                key={sugg}
                type="button"
                onClick={() => setName(sugg)}
                className="text-[10px] px-2 py-1 border border-gray-700 text-gray-400 hover:border-white hover:text-white uppercase tracking-wider transition-colors"
              >
                {sugg}
              </button>
            ))}
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-gray-700 text-white focus:border-white focus:outline-none focus:shadow-neon-white transition-all font-mono"
              placeholder="e.g. Salary"
              required
            />
          </div>

          {/* Amount & Currency */}
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Amount ({settings.currency})</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-gray-700 text-white focus:border-white focus:outline-none focus:shadow-neon-white transition-all font-mono text-lg"
              placeholder="0.00"
              required
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Frequency</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'day', label: 'Day' },
                { val: 'week', label: 'Week' },
                { val: 'month', label: 'Month' }
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setFrequency(opt.val as Frequency)}
                  className={`py-2 px-3 text-xs uppercase tracking-wider border transition-all ${
                    frequency === opt.val
                      ? `border-white bg-white text-black font-bold`
                      : 'border-gray-800 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Per Person Toggle */}
          {type === 'liability' && settings.familyMembers > 1 && (
            <label className="flex items-center gap-3 p-3 border border-gray-800 bg-surface cursor-pointer hover:border-gray-600">
              <input 
                type="checkbox" 
                checked={isPerPerson} 
                onChange={e => setIsPerPerson(e.target.checked)}
                className="w-4 h-4 accent-neon-red bg-black border-gray-600"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">Multiplier: x{settings.familyMembers} Persons</span>
              </div>
            </label>
          )}

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Select Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS_LIST.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`p-2 border transition-all ${
                    icon === ic
                      ? `border-white bg-white text-black`
                      : 'border-gray-800 text-gray-500 hover:border-gray-500'
                  }`}
                >
                  <Icon name={ic} size={18} />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-4 mt-6 font-bold uppercase tracking-[0.2em] transition-all hover:scale-[1.02] ${accentBg} text-black shadow-[0_0_15px_currentColor]`}
          >
            Save Data
          </button>
        </form>
      </div>
    </div>
  );
};