import React from 'react';
import { Modal } from './Modal';
import { useStore } from '../store/useStore';
import { Sliders, Wind } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setSettingsOpen, isInterferenceMode, setInterferenceMode, dampingFactor, setDampingFactor } = useStore();

  return (
    <Modal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} title="Configuración Avanzada">
      <div className="space-y-6 text-gray-300">
        
        {/* Modo Interferencia */}
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Wind size={18} className="text-blue-400" /> Modo Interferencia
            </h3>
            <p className="text-sm text-gray-400 mt-1">Activa un segundo emisor para visualizar el Principio de Superposición (patrón de Moiré).</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isInterferenceMode}
              onChange={(e) => setInterferenceMode(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Factor de Amortiguación */}
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
          <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
            <Sliders size={18} className="text-purple-400" /> Amortiguación del Medio (Damping)
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">Alto (0.95)</span>
            <input 
              type="range" 
              min="0.95" max="1.0" step="0.005"
              value={dampingFactor}
              onChange={(e) => setDampingFactor(parseFloat(e.target.value))}
              className="flex-1 accent-purple-500"
            />
            <span className="text-xs text-gray-400">Nulo (1.0)</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Valor actual: {dampingFactor}</p>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            onClick={() => setSettingsOpen(false)}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};
