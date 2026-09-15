import { useEffect, useRef } from 'react';
import { ModeloOnda } from '../engine/physics/ModeloOnda';
import { SistemaParticulas } from '../engine/physics/SistemaParticulas';
import { GestorAudio } from '../engine/audio/GestorAudio';
import { useStore } from '../store/useStore';
import * as PIXI from 'pixi.js';

export function useSimulationEngine(canvasRef: React.RefObject<HTMLDivElement>) {
  const modeloOndaRef = useRef(new ModeloOnda());
  const sistemaParticulasRef = useRef(new SistemaParticulas(modeloOndaRef.current, 800, 400, 15));
  const gestorAudioRef = useRef(new GestorAudio());
  const appRef = useRef<PIXI.Application | null>(null);
  const engineRef = useRef<any>(null); // To store Pixi app rendering loop

  const store = useStore();

  // Inicializar PixiJS y Audio
  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new PIXI.Application({
      width: 800,
      height: 400,
      backgroundColor: 0x030712,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    canvasRef.current.appendChild(app.view as any);
    appRef.current = app;

    // Aquí iría el setup de las capas del renderizador que extraemos del Renderizador.js original...
    // Por simplicidad, dejaremos que SimulationCanvas se encargue de dibujar en el app.ticker o lo montaremos aquí.
    
    return () => {
      app.destroy(true, { children: true });
      gestorAudioRef.current.detenerTono();
    };
  }, [canvasRef]);

  // Sincronizar store con modelos físicos
  useEffect(() => {
    const modelo = modeloOndaRef.current;
    const audio = gestorAudioRef.current;

    modelo.setFrecuencia(store.frequency);
    modelo.setAmplitud(store.amplitude);
    modelo.setModo(store.mode);

    if (store.medium === 'aire') modelo.setVelocidad(200);
    else if (store.medium === 'agua') modelo.setVelocidad(600);
    else if (store.medium === 'acero') modelo.setVelocidad(1200);

    if (store.soundEnabled && store.amplitude > 0 && !store.isPaused) {
      audio.iniciarTono(store.frequency * 100, store.waveShape);
      audio.setFrecuencia(store.frequency * 100);
      audio.setVolumen(store.amplitude / 100);
      audio.setTipoOnda(store.waveShape);
    } else {
      audio.detenerTono();
    }
  }, [store.frequency, store.amplitude, store.mode, store.soundEnabled, store.waveShape, store.medium, store.isPaused]);

  return {
    modeloOnda: modeloOndaRef.current,
    sistemaParticulas: sistemaParticulasRef.current,
    app: appRef.current,
  };
}
