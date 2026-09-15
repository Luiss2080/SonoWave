import { SimulationCanvas } from './components/SimulationCanvas';
import { Controls } from './components/Controls';
import { LessonsPanel } from './components/LessonsPanel';
import { Activity } from 'lucide-react';

function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-white overflow-hidden font-sans relative">
      
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/10 glass-panel rounded-none">
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
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">
            Iniciar Lección 1
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex p-6 gap-6 items-center justify-center relative z-10 w-full max-w-[1400px] mx-auto">
        
        <LessonsPanel />

        <div className="flex flex-col gap-4 flex-1 items-center">
          <div className="flex items-center justify-between px-4 w-full max-w-[800px]">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Vista de Propagación
            </h2>
          </div>
          <SimulationCanvas />
        </div>

        <Controls />

      </main>
      
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

    </div>
  );
}

export default App;
