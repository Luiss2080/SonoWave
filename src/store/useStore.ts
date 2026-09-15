import { create } from 'zustand';

interface SimulationState {
  frequency: number;
  amplitude: number;
  mode: 'continuo' | 'pulso';
  timeScale: 'normal' | 'lento';
  viewMode: 'ondas' | 'particulas' | 'ambos';
  soundEnabled: boolean;
  metricsVisible: boolean;
  setFrequency: (f: number) => void;
  setAmplitude: (a: number) => void;
  setMode: (m: 'continuo' | 'pulso') => void;
  setTimeScale: (ts: 'normal' | 'lento') => void;
  setViewMode: (vm: 'ondas' | 'particulas' | 'ambos') => void;
  setSoundEnabled: (s: boolean) => void;
  setMetricsVisible: (m: boolean) => void;
  reset: () => void;
}

const initialState = {
  frequency: 2.0,
  amplitude: 50,
  mode: 'continuo' as const,
  timeScale: 'normal' as const,
  viewMode: 'ambos' as const,
  soundEnabled: true,
  metricsVisible: true,
};

export const useStore = create<SimulationState>((set) => ({
  ...initialState,
  setFrequency: (f) => set({ frequency: f }),
  setAmplitude: (a) => set({ amplitude: a }),
  setMode: (m) => set({ mode: m }),
  setTimeScale: (ts) => set({ timeScale: ts }),
  setViewMode: (vm) => set({ viewMode: vm }),
  setSoundEnabled: (s) => set({ soundEnabled: s }),
  setMetricsVisible: (m) => set({ metricsVisible: m }),
  reset: () => set(initialState),
}));
