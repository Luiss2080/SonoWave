import React from 'react';
import { Activity, HelpCircle, Save } from 'lucide-react';
import { useStore } from '../store/useStore';

export const TopNavigation: React.FC = () => {
  const { setHelpModalOpen } = useStore();

  const handleSave = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'simulador-ondas-snapshot.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("Error: No se encontró el canvas de simulación.");
    }
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-white/10 glass-panel rounded-none relative z-20">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <Activity className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Laboratorio de Ondas
          </h1>
          <p className="text-xs text-gray-400 font-medium">Acústica y Propagación PRO</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          Simulación Activa
        </span>
        
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Save size={16} /> Guardar Snapshot
        </button>

        <button 
          onClick={() => setHelpModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 border border-blue-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <HelpCircle size={16} /> Ayuda
        </button>
      </div>
    </header>
  );
};
