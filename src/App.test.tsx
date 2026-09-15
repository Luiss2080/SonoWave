import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('Aplicación Principal (Smoke Test)', () => {
  it('debería renderizar el título de la aplicación sin crashear', () => {
    render(<App />);
    const titulo = screen.getByText('Laboratorio de Ondas');
    expect(titulo).toBeDefined();
  });
});
