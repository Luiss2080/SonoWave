import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Web Audio API
(window as any).AudioContext = vi.fn().mockImplementation(() => ({
  createOscillator: () => ({
    type: 'sine',
    frequency: { value: 0, setTargetAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    disconnect: vi.fn()
  }),
  createGain: () => ({
    gain: { value: 0, setTargetAtTime: vi.fn() },
    connect: vi.fn()
  }),
  destination: {},
  currentTime: 0
}));

// Mock PixiJS Canvas Context
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Array(4) })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => []),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
})) as any;

describe('Aplicación Principal (Smoke Test)', () => {
  it('debería renderizar el título de la aplicación sin crashear', () => {
    render(<App />);
    const titulo = screen.getByText('Laboratorio de Ondas');
    expect(titulo).toBeDefined();
  });
});
