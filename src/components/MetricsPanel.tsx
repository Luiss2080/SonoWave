import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Activity, Radio, Thermometer, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export const MetricsPanel: React.FC = () => {
  const store = useStore();
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const loop = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(loop);
    };
    
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  if (!store.metricsVisible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-6 left-6 z-30 bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 shadow-2xl pointer-events-none"
    >
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Activity size={14} className="text-blue-400" /> HUD Estadísticas
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Rendimiento</span>
          <div className="flex items-center gap-2 text-white font-mono">
            <Thermometer size={14} className={fps < 30 ? 'text-red-500' : 'text-green-500'} />
            <span className={fps < 30 ? 'text-red-400' : ''}>{fps} FPS</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Long. Onda (aprox)</span>
          <div className="flex items-center gap-2 text-white font-mono">
            <Radio size={14} className="text-purple-400" />
            <span>{(store.medium === 'aire' ? 343 : store.medium === 'agua' ? 1480 : 5000) / store.frequency}m</span>
          </div>
        </div>

        <div className="flex flex-col col-span-2 pt-2 border-t border-gray-700/50">
          <span className="text-xs text-gray-500">Estado del Motor</span>
          <div className="flex items-center gap-2 text-white font-mono mt-1">
            <Database size={14} className={store.isPaused ? 'text-yellow-500' : 'text-blue-500'} />
            <span>{store.isPaused ? 'PAUSADO' : 'CORRIENDO'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
