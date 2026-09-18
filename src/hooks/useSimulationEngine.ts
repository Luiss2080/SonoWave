import { useEffect, useRef, useState } from 'react';
import { ModeloOnda } from '../engine/physics/ModeloOnda';
import { SistemaParticulas } from '../engine/physics/SistemaParticulas';
import { GestorAudio } from '../engine/audio/GestorAudio';
import { useStore } from '../store/useStore';
import * as PIXI from 'pixi.js';

export function useSimulationEngine(canvasRef: React.RefObject<HTMLDivElement | null>) {
  const modeloOndaRef = useRef(new ModeloOnda());
  const sistemaParticulasRef = useRef(new SistemaParticulas(modeloOndaRef.current, 800, 400, 15));
  const gestorAudioRef = useRef(new GestorAudio());
  // Estado (no ref): al terminar init() asíncrono hay que re-renderizar para que
  // SimulationCanvas reciba la app y monte sus capas.
  const [app, setApp] = useState<PIXI.Application | null>(null);

  const store = useStore();

  // Inicializar PixiJS y Audio
  useEffect(() => {
    if (!canvasRef.current) return;

    let cancelado = false;
    let appCreada: PIXI.Application | null = null;

    const initPixi = async () => {
      const nuevaApp = new PIXI.Application();
      await nuevaApp.init({
        width: 800,
        height: 400,
        backgroundColor: 0x030712,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        preserveDrawingBuffer: true,
      });

      // El componente pudo desmontarse (p. ej. StrictMode) mientras init() corría.
      if (cancelado || !canvasRef.current) {
        nuevaApp.destroy(true, { children: true });
        return;
      }

      canvasRef.current.appendChild(nuevaApp.canvas);
      appCreada = nuevaApp;
      setApp(nuevaApp);
    };

    initPixi();

    return () => {
      cancelado = true;
      if (appCreada) {
        appCreada.destroy(true, { children: true });
        appCreada = null;
      }
      setApp(null);
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
    
    // Configuraciones avanzadas
    modelo.modoInterferencia = store.isInterferenceMode;
    modelo.factorAmortiguacion = store.dampingFactor;

  }, [store.frequency, store.amplitude, store.mode, store.soundEnabled, store.waveShape, store.medium, store.isPaused, store.isInterferenceMode, store.dampingFactor]);

  return {
    modeloOnda: modeloOndaRef.current,
    sistemaParticulas: sistemaParticulasRef.current,
    app,
  };
}
