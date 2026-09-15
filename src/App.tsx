import { SimulationCanvas } from './components/SimulationCanvas';
import { Controls } from './components/Controls';
import { LessonsPanel } from './components/LessonsPanel';
import { TopNavigation } from './components/TopNavigation';
import { OnboardingModal } from './components/OnboardingModal';
import { MetricsPanel } from './components/MetricsPanel';

function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-white overflow-hidden font-sans relative">
      
      <TopNavigation />
      <OnboardingModal />

      {/* Main Content */}
      <main className="flex-1 flex p-6 gap-6 items-center justify-center relative z-10 w-full max-w-[1400px] mx-auto">
        
        <LessonsPanel />

        <div className="flex flex-col gap-4 flex-1 items-center relative">
          <MetricsPanel />
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
