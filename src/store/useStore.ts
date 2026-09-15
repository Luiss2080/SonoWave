import { create } from 'zustand';

interface SimulationState {
  frequency: number;
  amplitude: number;
  mode: 'continuo' | 'pulso';
  waveShape: 'sine' | 'square' | 'triangle';
  medium: 'aire' | 'agua' | 'acero';
  timeScale: 'normal' | 'lento';
  viewMode: 'ondas' | 'particulas' | 'ambos';
  soundEnabled: boolean;
  metricsVisible: boolean;
  isPaused: boolean;
  sourceVelocity: number; 
  waveColor: string;
  isSettingsOpen: boolean;
  isInterferenceMode: boolean;
  dampingFactor: number;
  setFrequency: (f: number) => void;
  setAmplitude: (a: number) => void;
  setMode: (m: 'continuo' | 'pulso') => void;
  setTimeScale: (ts: 'normal' | 'lento') => void;
  setViewMode: (vm: 'ondas' | 'particulas' | 'ambos') => void;
  setSoundEnabled: (s: boolean) => void;
  setMetricsVisible: (m: boolean) => void;
  isHelpModalOpen: boolean;
  setHelpModalOpen: (isOpen: boolean) => void;
  setWaveShape: (shape: 'sine' | 'square' | 'triangle') => void;
  setMedium: (medium: 'aire' | 'agua' | 'acero') => void;
  setPaused: (p: boolean) => void;
  setSourceVelocity: (v: number) => void;
  setWaveColor: (c: string) => void;
  setSettingsOpen: (isOpen: boolean) => void;
  setInterferenceMode: (isActive: boolean) => void;
  setDampingFactor: (d: number) => void;
  reset: () => void;
}

const initialState = {
  frequency: 2.0,
  amplitude: 50,
  mode: 'continuo' as const,
  waveShape: 'sine' as const,
  medium: 'aire' as const,
  timeScale: 'normal' as const,
  viewMode: 'ambos' as const,
  soundEnabled: true,
  metricsVisible: true,
  isHelpModalOpen: true, 
  isPaused: false,
  sourceVelocity: 0,
  waveColor: 'cyan',
  isSettingsOpen: false,
  isInterferenceMode: false,
  dampingFactor: 0.99,
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
  setHelpModalOpen: (isOpen) => set({ isHelpModalOpen: isOpen }),
  setWaveShape: (shape) => set({ waveShape: shape }),
  setMedium: (medium) => set({ medium }),
  setPaused: (p) => set({ isPaused: p }),
  setSourceVelocity: (v) => set({ sourceVelocity: v }),
  setWaveColor: (c) => set({ waveColor: c }),
  setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  setInterferenceMode: (isActive) => set({ isInterferenceMode: isActive }),
  setDampingFactor: (d) => set({ dampingFactor: d }),
  reset: () => set(initialState),
}));
