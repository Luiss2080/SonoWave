import { BookOpen, CheckCircle, Lock, Trophy } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Tooltip } from './Tooltip';

const LESSONS = [
  { id: 1, title: "Fundamentos de la Onda", desc: "Aprende qué es la frecuencia", locked: false, completed: true },
  { id: 2, title: "Amplitud y Volumen", desc: "Siente el poder del sonido", locked: false, completed: false },
  { id: 3, title: "El Efecto Doppler", desc: "Ondas en movimiento (Pro)", locked: true, completed: false },
  { id: 4, title: "Frecuencia de Resonancia", desc: "Rompe la copa de cristal (Pro)", locked: true, completed: false },
];

export const LessonsPanel: React.FC = () => {
  const store = useStore();

  return (
    <div className="w-72 h-[600px] flex flex-col gap-4 p-6 glass-panel overflow-y-auto">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-700">
        <Trophy className="text-yellow-400" size={24} />
        <h2 className="text-xl font-bold tracking-tight">Misiones</h2>
      </div>

      <div className="flex flex-col gap-3">
        {LESSONS.map((lesson) => (
          <motion.div 
            whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2, zIndex: 10 }}
            whileTap={{ scale: 0.98 }}
            key={lesson.id}
            className={`p-4 rounded-xl border transition-colors shadow-lg ${
              lesson.locked ? 'bg-gray-900/50 border-gray-800 opacity-60' : 
              lesson.completed ? 'bg-green-500/10 border-green-500/30 cursor-pointer hover:bg-green-500/20' : 
              'bg-blue-500/10 border-blue-500/30 cursor-pointer hover:bg-blue-500/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-sm text-white mb-1 flex items-center gap-2">
                  {lesson.title}
                  {lesson.locked && (
                    <Tooltip content="Requiere suscripción Pro">
                      <Lock size={12} className="text-gray-500" />
                    </Tooltip>
                  )}
                </h3>
                <p className="text-xs text-gray-400">{lesson.desc}</p>
              </div>
              {lesson.completed && <CheckCircle size={18} className="text-green-400 flex-shrink-0" />}
              {!lesson.completed && !lesson.locked && <BookOpen size={18} className="text-blue-400 flex-shrink-0" />}
            </div>
            
            {!lesson.locked && !lesson.completed && (
              <div className="mt-3 pt-3 border-t border-blue-500/20">
                <button 
                  className="w-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white py-1.5 rounded-lg transition-colors"
                  onClick={() => {
                    if (lesson.id === 2) {
                      store.setAmplitude(100);
                      store.setFrequency(5);
                    }
                  }}
                >
                  Iniciar Reto
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-auto pt-4 text-center">
        <button className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white text-sm font-bold rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all">
          Desbloquear Pro
        </button>
      </div>
    </div>
  );
};
