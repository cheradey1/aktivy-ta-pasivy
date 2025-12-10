import React, { useState } from 'react';
import { Settings, Currency } from '../types';
import { Icon } from './Icon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdate: (newSettings: Settings) => void;
  monthlyBalance: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdate, monthlyBalance }) => {
  const [projectionYears, setProjectionYears] = useState(1);

  if (!isOpen) return null;

  const currencies: Currency[] = ['₴', '$', '€'];
  
  // Projection Logic
  const projectedValue = monthlyBalance * 12 * projectionYears;
  const isPositiveProjection = projectedValue >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-black border border-gray-700 w-full max-w-sm shadow-2xl p-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-neon-blue/5 rounded-bl-full pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4 relative z-10">
          <h2 className="text-xl font-bold font-mono uppercase text-white tracking-widest flex items-center gap-2">
            <Icon name="Cpu" size={20} className="text-neon-blue" />
            System Config
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="space-y-8 relative z-10">
          
          {/* Currency */}
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Unit of Account</label>
            <div className="flex gap-2">
              {currencies.map(curr => (
                <button
                  key={curr}
                  onClick={() => onUpdate({ ...settings, currency: curr })}
                  className={`flex-1 py-2 text-sm font-bold border transition-all ${
                    settings.currency === curr
                      ? 'border-neon-blue bg-neon-blue/10 text-neon-blue shadow-neon-blue'
                      : 'border-gray-800 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Job Status */}
          <div className="flex items-center justify-between p-3 border border-gray-800 bg-surface">
            <div className="flex items-center gap-3">
              <Icon name="Briefcase" className="text-gray-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Active Employment</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.hasJob} 
                onChange={(e) => onUpdate({ ...settings, hasJob: e.target.checked })}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-900 border border-gray-700 peer-focus:outline-none peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-gray-500 after:border-gray-300 after:border after:h-4 after:w-4 after:transition-all peer-checked:bg-neon-blue/20 peer-checked:border-neon-blue peer-checked:after:bg-neon-blue peer-checked:after:border-white peer-checked:after:shadow-[0_0_10px_#00f3ff]"></div>
            </label>
          </div>

          {/* Future Projection / Wealth Calculator */}
          <div className="border border-neon-blue/50 p-4 bg-neon-blue/5 relative">
            <div className="absolute -top-3 left-3 bg-black px-2 text-neon-blue text-xs font-bold uppercase tracking-widest border border-neon-blue/50 shadow-[0_0_10px_rgba(0,243,255,0.2)]">
              Future Simulator
            </div>
            
            <div className="mt-2 mb-4">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-gray-400 text-[10px] uppercase font-mono">Time Horizon</span>
                 <span className="text-neon-blue font-bold font-mono text-xl">{projectionYears} Years</span>
               </div>
               <input 
                 type="range"
                 min="1"
                 max="100"
                 value={projectionYears}
                 onChange={(e) => setProjectionYears(parseInt(e.target.value))}
                 className="w-full h-1 bg-gray-800 appearance-none cursor-pointer accent-neon-blue"
               />
               <div className="flex justify-between text-[10px] text-gray-600 font-mono mt-1">
                 <span>1Y</span>
                 <span>50Y</span>
                 <span>100Y</span>
               </div>
            </div>

            <div className="border-t border-dashed border-gray-700 pt-3">
              <span className="block text-gray-500 text-[10px] uppercase tracking-widest mb-1">Projected Accumulation</span>
              <div className={`text-2xl font-black font-mono break-all ${isPositiveProjection ? 'text-white' : 'text-neon-red'}`}>
                {isPositiveProjection ? '' : ''}{projectedValue.toLocaleString()} {settings.currency}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Based on current monthly balance of {monthlyBalance.toLocaleString()} {settings.currency}
              </p>
            </div>
          </div>

        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          Close Config
        </button>
      </div>
    </div>
  );
};