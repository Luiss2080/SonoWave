import { describe, it, expect, beforeEach } from 'vitest';
import { SistemaParticulas } from './SistemaParticulas';
import { ModeloOnda } from './ModeloOnda';

describe('SistemaParticulas', () => {
  let modelo: ModeloOnda;

  beforeEach(() => {
    modelo = new ModeloOnda();
  });

  it('debería crear una partícula por cada celda de la cuadrícula ancho x alto / espaciado', () => {
    const sistema = new SistemaParticulas(modelo, 100, 100, 20);
    // 5 columnas (0,20,40,60,80) x 5 filas (0,20,40,60,80) = 25 partículas
    expect(sistema.getParticulas().length).toBe(25);
  });

  it('debería asignar a cada partícula un vector de dirección unitario respecto a la fuente', () => {
    const sistema = new SistemaParticulas(modelo, 200, 200, 25);

    for (const p of sistema.getParticulas()) {
      if (p.distanciaOriginal === 0) continue;
      const magnitud = Math.sqrt(p.dirX * p.dirX + p.dirY * p.dirY);
      expect(magnitud).toBeCloseTo(1, 5);
    }
  });

  it('debería inicializar xActual/yActual iguales a las posiciones originales', () => {
    const sistema = new SistemaParticulas(modelo, 60, 60, 20);
    for (const p of sistema.getParticulas()) {
      expect(p.xActual).toBe(p.xOriginal);
      expect(p.yActual).toBe(p.yOriginal);
    }
  });

  it('debería desplazar las partículas a lo largo de su vector de dirección al actualizar', () => {
    const sistema = new SistemaParticulas(modelo, 40, 40, 40); // una sola partícula
    modelo.setAmplitud(100);
    modelo.setFrecuencia(1);
    modelo.actualizar(0.25); // avanzar la simulación para generar historial de emisión

    sistema.actualizar();

    const p = sistema.getParticulas()[0];
    const desplazamientoEsperado = modelo.getDesplazamientoEn(p.distanciaOriginal);

    expect(p.xActual).toBeCloseTo(p.xOriginal + desplazamientoEsperado * p.dirX, 5);
    expect(p.yActual).toBeCloseTo(p.yOriginal + desplazamientoEsperado * p.dirY, 5);
  });

  it('no debería mover las partículas si el modelo de onda no tiene desplazamiento (t=0)', () => {
    const sistema = new SistemaParticulas(modelo, 40, 40, 40);
    sistema.actualizar();

    const p = sistema.getParticulas()[0];
    expect(p.xActual).toBe(p.xOriginal);
    expect(p.yActual).toBe(p.yOriginal);
  });
});
