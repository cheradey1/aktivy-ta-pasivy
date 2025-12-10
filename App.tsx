import React, { useState, useEffect, useMemo } from 'react';
import { FinanceItem, Settings, FREQUENCY_MULTIPLIERS, ItemType } from './types';
import { DEFAULT_SETTINGS, INITIAL_ITEMS } from './constants';
import { Icon } from './components/Icon';
import { FinanceCard } from './components/FinanceCard';
import { AddEditModal } from './components/AddEditModal';
import { SettingsModal } from './components/SettingsModal';
import { DashboardChart } from './components/DashboardChart';

const App = () => {
  const [items, setItems] = useState<FinanceItem[]>(() => {
    try {
      const saved = localStorage.getItem('fp_items');
      return saved ? JSON.parse(saved) : INITIAL_ITEMS;
    } catch (e) {
      return INITIAL_ITEMS;
    }
  });

  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('fp_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FinanceItem | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<ItemType>('asset');

  useEffect(() => {
    localStorage.setItem('fp_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('fp_settings', JSON.stringify(settings));
    document.documentElement.classList.add('dark'); // Force dark mode for Neon theme
  }, [settings]);

  const calculateTotal = (type: ItemType) => {
    return items
      .filter(i => i.type === type)
      .reduce((acc, item) => {
        let monthly = item.amount * FREQUENCY_MULTIPLIERS[item.frequency];
        if (item.isPerPerson && type === 'liability') {
          monthly *= settings.familyMembers;
        }
        return acc + monthly;
      }, 0);
  };

  const totalAssets = useMemo(() => calculateTotal('asset'), [items, settings]);
  const totalLiabilities = useMemo(() => calculateTotal('liability'), [items, settings]);
  const balance = totalAssets - totalLiabilities;
  const isPositive = balance >= 0;

  const handleAddItem = (item: FinanceItem) => {
    if (editingItem) {
      setItems(items.map(i => i.id === item.id ? item : i));
    } else {
      setItems([...items, item]);
    }
    setEditingItem(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm('Видалити цей запис?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleEdit = (item: FinanceItem) => {
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

  const renderList = (type: ItemType) => {
    const list = items.filter(i => i.type === type);
    return (
      <div className="space-y-3">
        {list.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-800 rounded-none bg-surface/30">
             <Icon name={type === 'asset' ? 'PiggyBank' : 'CreditCard'} size={40} className="mx-auto mb-3 text-gray-700" />
             <p className="text-gray-600 font-mono text-sm">НЕМАЄ ДАНИХ</p>
          </div>
        ) : (
          list.map(item => (
            <FinanceCard 
              key={item.id} 
              item={item} 
              currency={settings.currency} 
              familyMembers={settings.familyMembers}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-24 md:pb-10 font-sans bg-background text-white selection:bg-neon-green selection:text-black">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-sm border-b border-gray-800 px-4 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
           <div className="border border-neon-green p-1.5 shadow-[0_0_8px_rgba(57,255,20,0.5)]">
             <Icon name="Activity" size={20} className="text-neon-green" />
           </div>
           <div>
             <h1 className="font-bold text-lg leading-none tracking-widest uppercase">FinPlan</h1>
             <p className="text-[9px] text-gray-500 tracking-[0.2em] mt-0.5">NEON EDITION</p>
           </div>
        </div>
        <button onClick={() => setIsSettingsOpen(true)} className="p-2 border border-gray-700 hover:border-white hover:shadow-neon-white transition-all">
          <Icon name="Settings" size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 space-y-8">
        
        {/* Balance HUD */}
        <div className={`
          relative overflow-hidden p-6 border-2 
          ${isPositive ? 'border-neon-green shadow-neon-green' : 'border-neon-red shadow-neon-red'}
          bg-black
        `}>
          {/* Scanlines effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-0 opacity-20"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-400 text-xs font-mono mb-2 uppercase tracking-widest">>> Monthly Balance Status</p>
              <h2 className={`text-5xl md:text-6xl font-black tracking-tighter font-mono ${isPositive ? 'text-neon-green drop-shadow-[0_0_5px_rgba(57,255,20,0.8)]' : 'text-neon-red drop-shadow-[0_0_5px_rgba(255,0,60,0.8)]'}`}>
                {balance > 0 ? '+' : ''}{balance.toLocaleString()} {settings.currency}
              </h2>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wide text-white bg-white/10 px-2 py-1">
                {isPositive ? (
                   <span className="text-neon-green flex gap-2 items-center"><Icon name="CheckSquare" size={14} /> SYSTEM OPTIMAL</span>
                ) : (
                   <span className="text-neon-red flex gap-2 items-center"><Icon name="AlertTriangle" size={14} /> WARNING: DEFICIT</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="border border-gray-800 bg-surface/50 p-3">
                 <span className="block text-gray-500 text-[10px] uppercase tracking-widest mb-1">Total Assets</span>
                 <span className="text-neon-green font-mono font-bold text-xl">{totalAssets.toLocaleString()} {settings.currency}</span>
               </div>
               <div className="border border-gray-800 bg-surface/50 p-3">
                 <span className="block text-gray-500 text-[10px] uppercase tracking-widest mb-1">Total Liabilities</span>
                 <span className="text-neon-red font-mono font-bold text-xl">{totalLiabilities.toLocaleString()} {settings.currency}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                 <h3 className="text-white font-mono text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-white"></span> Analytics
                 </h3>
                 <DashboardChart totalAssets={totalAssets} totalLiabilities={totalLiabilities} currency={settings.currency} />
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Desktop Lists */}
                <div className="hidden md:block">
                    <h3 className="text-neon-green font-mono text-sm uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
                        <Icon name="ArrowUpRight" size={16}/> Assets Input
                    </h3>
                    {renderList('asset')}
                    <button 
                        onClick={() => { setActiveTab('asset'); setEditingItem(undefined); setIsAddModalOpen(true); }}
                        className="w-full mt-4 py-3 border border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-all font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(57,255,20,0.1)] hover:shadow-[0_0_15px_rgba(57,255,20,0.6)]"
                    >
                        <Icon name="PlusSquare" size={16} /> Add Asset
                    </button>
                </div>
                
                <div className="hidden md:block">
                    <h3 className="text-neon-red font-mono text-sm uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
                        <Icon name="ArrowDownRight" size={16}/> Liabilities Input
                    </h3>
                    {renderList('liability')}
                    <button 
                         onClick={() => { setActiveTab('liability'); setEditingItem(undefined); setIsAddModalOpen(true); }}
                         className="w-full mt-4 py-3 border border-neon-red text-neon-red hover:bg-neon-red hover:text-black transition-all font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(255,0,60,0.1)] hover:shadow-[0_0_15px_rgba(255,0,60,0.6)]"
                    >
                        <Icon name="PlusSquare" size={16} /> Add Liability
                    </button>
                </div>
            </div>
        </section>

        {/* Mobile Tabs View */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setActiveTab('asset')}
              className={`py-3 text-xs font-bold uppercase tracking-widest border transition-all ${
                activeTab === 'asset' 
                  ? 'border-neon-green bg-neon-green/10 text-neon-green shadow-neon-green' 
                  : 'border-gray-800 text-gray-500'
              }`}
            >
              Assets
            </button>
            <button
              onClick={() => setActiveTab('liability')}
              className={`py-3 text-xs font-bold uppercase tracking-widest border transition-all ${
                activeTab === 'liability' 
                  ? 'border-neon-red bg-neon-red/10 text-neon-red shadow-neon-red' 
                  : 'border-gray-800 text-gray-500'
              }`}
            >
              Liabilities
            </button>
          </div>
          
          <div className="animate-fade-in min-h-[300px]">
            {renderList(activeTab)}
          </div>
        </div>

      </main>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => { setEditingItem(undefined); setIsAddModalOpen(true); }}
        className={`md:hidden fixed bottom-6 right-6 w-14 h-14 bg-black border-2 text-white rounded-none shadow-lg flex items-center justify-center active:scale-95 transition-all z-40 ${activeTab === 'asset' ? 'border-neon-green shadow-neon-green text-neon-green' : 'border-neon-red shadow-neon-red text-neon-red'}`}
      >
        <Icon name="Plus" size={28} />
      </button>

      <AddEditModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddItem}
        editItem={editingItem}
        defaultType={activeTab}
        settings={settings}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdate={setSettings}
        monthlyBalance={balance}
      />
    </div>
  );
};

export default App;