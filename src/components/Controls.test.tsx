import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Controls } from './Controls';
import { useStore } from '../store/useStore';

describe('Componente Controls', () => {
  beforeEach(() => {
    useStore.getState().reset();
  });

  it('debería renderizar el botón de Senoidal y cambiar el estado al hacer clic', () => {
    render(<Controls />);
    
    const botonSenoidal = screen.getByText('Senoidal');
    expect(botonSenoidal).toBeDefined();

    // Cambiamos a Cuadrada
    const botonCuadrada = screen.getByText('Cuadrada');
    fireEvent.click(botonCuadrada);
    
    expect(useStore.getState().waveShape).toBe('square');
  });

  it('debería permitir cambiar el medio físico a agua', () => {
    render(<Controls />);
    
    const botonAgua = screen.getByText('Agua');
    fireEvent.click(botonAgua);

    expect(useStore.getState().medium).toBe('agua');
  });

  it('debería alternar el sonido', () => {
    render(<Controls />);
    const botonSonido = screen.getByText(/Audio/); 
    
    fireEvent.click(botonSonido);
    expect(useStore.getState().soundEnabled).toBe(false);
  });
});
