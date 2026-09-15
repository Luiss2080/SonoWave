import React from 'react';
import { Modal } from './Modal';
import { useStore } from '../store/useStore';
import { Waves, Zap, Volume2, Trophy } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isHelpModalOpen, setHelpModalOpen } = useStore();

  return (
    <Modal isOpen={isHelpModalOpen} onClose={() => setHelpModalOpen(false)} title="Bienvenido al Laboratorio PRO 🌊">
      <div className="space-y-6 text-gray-300">
        <p className="text-lg">
          Has entrado al simulador avanzado de acústica y propagación de ondas sonoras. 
          Aquí podrás experimentar con las propiedades físicas del sonido en tiempo real.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <Waves className="text-blue-400 mb-2" size={24} />
            <h3 className="text-white font-semibold mb-1">Visualización Neón</h3>
            <p className="text-sm">Observa cómo la presión viaja a través del espacio mediante anillos u observando las moléculas directamente.</p>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <Volume2 className="text-green-400 mb-2" size={24} />
            <h3 className="text-white font-semibold mb-1">Audio Inmersivo</h3>
            <p className="text-sm">Escucha las ondas senoidales, cuadradas o triangulares sincronizadas matemáticamente con la simulación.</p>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <Zap className="text-yellow-400 mb-2" size={24} />
            <h3 className="text-white font-semibold mb-1">Motor Reactivo</h3>
            <p className="text-sm">El motor procesa a 60fps usando WebGL (PixiJS) y Zustand, sin mutaciones costosas al DOM.</p>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <Trophy className="text-purple-400 mb-2" size={24} />
            <h3 className="text-white font-semibold mb-1">Misiones</h3>
            <p className="text-sm">Desafíate completando los experimentos del panel izquierdo para dominar la teoría acústica.</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            onClick={() => setHelpModalOpen(false)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
          >
            Empezar a experimentar
          </button>
        </div>
      </div>
    </Modal>
  );
};
