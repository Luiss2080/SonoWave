import { describe, it, expect, beforeEach } from 'vitest';
import { ModeloOnda } from './ModeloOnda';

describe('ModeloOnda Físico', () => {
  let modelo: ModeloOnda;

  beforeEach(() => {
    modelo = new ModeloOnda();
  });

  it('debería iniciar con tiempo 0', () => {
    expect(modelo.tiempo).toBe(0);
  });

  it('debería avanzar el tiempo al llamar actualizar', () => {
    modelo.actualizar(0.5);
    expect(modelo.tiempo).toBe(0.5);
  });

  it('debería añadir ondas interactivas (pulsos manuales)', () => {
    modelo.agregarOndaExtra(100, 100);
    expect(modelo.ondasExtra.length).toBe(1);
    expect(modelo.ondasExtra[0].x).toBe(100);
    expect(modelo.ondasExtra[0].tiempoInicio).toBe(0);
  });

  it('debería limpiar ondas manuales tras 3 segundos', () => {
    modelo.agregarOndaExtra(10, 10);
    modelo.actualizar(4.0); // Avanzar 4 segundos
    expect(modelo.ondasExtra.length).toBe(0);
  });

  it('debería calcular la presión dependiendo de la amplitud', () => {
    modelo.setAmplitud(100);
    modelo.setFrecuencia(1);
    modelo.actualizar(0.5); // Avanzar al pico de la onda senoidal
    const presion = modelo.getPresionEn(0);
    // Presión cerca de la fuente
    expect(Math.abs(presion)).toBeGreaterThan(0);
  });
});
