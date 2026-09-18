import { describe, it, expect, afterEach, vi } from 'vitest';
import { GestorAudio } from './GestorAudio';

function mockAudioContextExitoso() {
  (window as any).AudioContext = class {
    createOscillator() {
      return {
        type: 'sine',
        frequency: { value: 0, setTargetAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        disconnect: vi.fn(),
      };
    }
    createGain() {
      return {
        gain: { value: 0, setTargetAtTime: vi.fn() },
        connect: vi.fn(),
      };
    }
    destination = {};
    currentTime = 0;
  };
}

describe('GestorAudio', () => {
  const AudioContextOriginal = (window as any).AudioContext;

  afterEach(() => {
    (window as any).AudioContext = AudioContextOriginal;
    vi.restoreAllMocks();
  });

  it('debería reproducir un tono cuando el AudioContext se crea correctamente', () => {
    mockAudioContextExitoso();
    const gestor = new GestorAudio();

    gestor.iniciarTono(440);

    expect(gestor.estaDisponible()).toBe(true);
  });

  it('debería quedar en estado no disponible si el navegador no soporta AudioContext', () => {
    delete (window as any).AudioContext;
    delete (window as any).webkitAudioContext;
    const gestor = new GestorAudio();

    expect(() => gestor.inicializar()).not.toThrow();
    expect(gestor.estaDisponible()).toBe(false);
  });

  it('debería quedar en estado no disponible si el constructor de AudioContext lanza una excepción', () => {
    (window as any).AudioContext = class {
      constructor() {
        throw new Error('No se pudo crear el AudioContext (política del navegador).');
      }
    };
    const gestor = new GestorAudio();

    expect(() => gestor.inicializar()).not.toThrow();
    expect(gestor.estaDisponible()).toBe(false);
  });

  it('no debería lanzar una excepción al pedir iniciarTono cuando el audio no está disponible', () => {
    delete (window as any).AudioContext;
    delete (window as any).webkitAudioContext;
    const gestor = new GestorAudio();

    expect(() => gestor.iniciarTono(440)).not.toThrow();
    expect(gestor.estaDisponible()).toBe(false);
  });

  it('detenerTono no debería lanzar una excepción si nunca se inicializó el audio', () => {
    delete (window as any).AudioContext;
    delete (window as any).webkitAudioContext;
    const gestor = new GestorAudio();

    expect(() => gestor.detenerTono()).not.toThrow();
  });
});
