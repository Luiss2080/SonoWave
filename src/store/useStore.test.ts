import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './useStore';

describe('useStore Zustand State', () => {
  beforeEach(() => {
    useStore.getState().reset();
  });

  it('debería tener valores iniciales correctos', () => {
    const state = useStore.getState();
    expect(state.frequency).toBe(2.0);
    expect(state.amplitude).toBe(50);
    expect(state.isPaused).toBe(false);
    expect(state.sourceVelocity).toBe(0);
    expect(state.waveColor).toBe('cyan');
  });

  it('debería cambiar la frecuencia correctamente', () => {
    useStore.getState().setFrequency(5.0);
    expect(useStore.getState().frequency).toBe(5.0);
  });

  it('debería pausar la simulación', () => {
    useStore.getState().setPaused(true);
    expect(useStore.getState().isPaused).toBe(true);
  });

  it('debería resetear al estado inicial', () => {
    useStore.getState().setFrequency(10.0);
    useStore.getState().setPaused(true);
    useStore.getState().reset();
    
    const state = useStore.getState();
    expect(state.frequency).toBe(2.0);
    expect(state.isPaused).toBe(false);
  });
});
