import { useStore } from '../store/useStore';
import { Settings2, Volume2, VolumeX, Activity, Eye, RefreshCcw, PlayCircle, PauseCircle, Wind } from 'lucide-react';
import { Tooltip } from './Tooltip';

export const Controls: React.FC = () => {
  const store = useStore();

  return (
    <div className="w-80 h-[600px] flex flex-col gap-6 p-6 glass-panel overflow-y-auto">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-700">
        <Settings2 className="text-blue-400" size={24} />
        <h2 className="text-xl font-bold tracking-tight">Controles Pro</h2>
      </div>

      {/* Control de Reproducción (Modo) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Modo de Emisión</h3>
        <div className="flex bg-gray-900/50 rounded-lg p-1">
          <button 
            className={`flex-1 py-2 rounded-md transition-all text-sm font-medium flex items-center justify-center gap-2
              ${store.mode === 'continuo' ? 'bg-blue-600 shadow-md text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => store.setMode('continuo')}
          >
            <PlayCircle size={16} /> Continuo
          </button>
          <button 
            className={`flex-1 py-2 rounded-md transition-all text-sm font-medium flex items-center justify-center gap-2
              ${store.mode === 'pulso' ? 'bg-blue-600 shadow-md text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => store.setMode('pulso')}
          >
            <Activity size={16} /> Pulso
          </button>
        </div>
      </div>

      {/* Tipo de Onda (Audio) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Tipo de Onda</h3>
        <div className="flex bg-gray-900/50 rounded-lg p-1">
          <button 
            className={`flex-1 py-1.5 rounded-md transition-all text-xs font-medium 
              ${store.waveShape === 'sine' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => store.setWaveShape('sine')}
          >
            Senoidal
          </button>
          <button 
            className={`flex-1 py-1.5 rounded-md transition-all text-xs font-medium 
              ${store.waveShape === 'square' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => store.setWaveShape('square')}
          >
            Cuadrada
          </button>
          <button 
            className={`flex-1 py-1.5 rounded-md transition-all text-xs font-medium 
              ${store.waveShape === 'triangle' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => store.setWaveShape('triangle')}
          >
            Triangular
          </button>
        </div>
      </div>

      {/* Parámetros Físicos */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Parámetros Físicos</h3>
        
        {/* Frecuencia */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm">
            <span>Frecuencia</span>
            <span className="font-mono text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">{store.frequency.toFixed(1)} Hz</span>
          </div>
          <input 
            type="range" min="1" max="5" step="0.1" 
            value={store.frequency} 
            onChange={(e) => store.setFrequency(parseFloat(e.target.value))}
            className="w-full accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Amplitud */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm">
            <span>Amplitud</span>
            <span className="font-mono text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">{store.amplitude}%</span>
          </div>
          <input 
            type="range" min="0" max="100" step="1" 
            value={store.amplitude} 
            onChange={(e) => store.setAmplitude(parseInt(e.target.value))}
            className="w-full accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Medio de Propagación */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Wind size={16} /> Medio Físico
        </h3>
        <div className="flex bg-gray-900/50 rounded-lg p-1">
          <Tooltip content="Sonido viaja a ~343 m/s">
            <button 
              className={`flex-1 w-full py-1.5 rounded-md transition-all text-xs font-medium 
                ${store.medium === 'aire' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => store.setMedium('aire')}
            >
              Aire
            </button>
          </Tooltip>
          <Tooltip content="Sonido viaja a ~1480 m/s">
            <button 
              className={`flex-1 w-full py-1.5 rounded-md transition-all text-xs font-medium 
                ${store.medium === 'agua' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => store.setMedium('agua')}
            >
              Agua
            </button>
          </Tooltip>
          <Tooltip content="Sonido viaja a ~5000 m/s">
            <button 
              className={`flex-1 w-full py-1.5 rounded-md transition-all text-xs font-medium 
                ${store.medium === 'acero' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => store.setMedium('acero')}
            >
              Acero
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Visualización */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Visualización</h3>
        
        <div className="flex bg-gray-900/50 rounded-lg p-1">
          <button 
            className={`flex-1 py-1.5 rounded-md transition-all text-xs font-medium 
              ${store.viewMode === 'ondas' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
            onClick={() => store.setViewMode('ondas')}
          >
            Ondas
          </button>
          <button 
            className={`flex-1 py-1.5 rounded-md transition-all text-xs font-medium 
              ${store.viewMode === 'particulas' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
            onClick={() => store.setViewMode('particulas')}
          >
            Partículas
          </button>
          <button 
            className={`flex-1 py-1.5 rounded-md transition-all text-xs font-medium 
              ${store.viewMode === 'ambos' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
            onClick={() => store.setViewMode('ambos')}
          >
            Ambos
          </button>
        </div>
      </div>

      {/* Color de Onda */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Color Base</h3>
        <div className="flex bg-gray-900/50 rounded-lg p-1">
          <button 
            className={`flex-1 py-1.5 rounded-md transition-all text-xs font-medium 
              ${store.waveColor === 'cyan' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => store.setWaveColor('cyan')}
          >
            Cyan
          </button>
          <button 
            className={`flex-1 py-1.5 rounded-md transition-all text-xs font-medium 
              ${store.waveColor === 'magenta' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => store.setWaveColor('magenta')}
          >
            Magenta
          </button>
          <button 
            className={`flex-1 py-1.5 rounded-md transition-all text-xs font-medium 
              ${store.waveColor === 'green' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => store.setWaveColor('green')}
          >
            Neón
          </button>
        </div>
      </div>

      {/* Toggles Rápidos */}
      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex gap-2">
          <Tooltip content="Configuración Avanzada">
            <button 
              onClick={() => store.setSettingsOpen(true)}
              className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              <Settings2 size={18} />
            </button>
          </Tooltip>
          <Tooltip content="Métricas">
            <button 
              onClick={() => store.setMetricsVisible(!store.metricsVisible)}
              className={`p-2 rounded-lg transition-colors ${store.metricsVisible ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              <Eye size={18} />
            </button>
          </Tooltip>
        </div>

        <button 
          className={`flex items-center justify-between p-3 rounded-lg border transition-all
            ${store.soundEnabled ? 'border-blue-500/50 bg-blue-500/10' : 'border-gray-700 bg-gray-800/50 hover:bg-gray-700'}`}
          onClick={() => store.setSoundEnabled(!store.soundEnabled)}
        >
          <div className="flex items-center gap-3">
            {store.soundEnabled ? <Volume2 size={18} className="text-blue-400" /> : <VolumeX size={18} className="text-gray-400" />}
            <span className="text-sm font-medium">Audio Inmersivo</span>
          </div>
          <div className={`w-8 h-4 rounded-full transition-colors relative ${store.soundEnabled ? 'bg-blue-500' : 'bg-gray-600'}`}>
            <div className={`absolute w-3 h-3 bg-white rounded-full top-0.5 transition-transform ${store.soundEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </div>
        </button>

        <button 
          className="flex items-center justify-center gap-2 p-3 mt-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm font-semibold"
          onClick={() => store.reset()}
        >
          <RefreshCcw size={16} /> Reiniciar Simulación
        </button>
      </div>
    </div>
  );
};
