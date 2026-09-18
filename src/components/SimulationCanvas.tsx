import React, { useRef, useEffect } from 'react';
import { useSimulationEngine } from '../hooks/useSimulationEngine';
import { useStore } from '../store/useStore';
import * as PIXI from 'pixi.js';
import { AdvancedBloomFilter } from 'pixi-filters';

export const SimulationCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { modeloOnda, sistemaParticulas, app } = useSimulationEngine(containerRef);
  const store = useStore();

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    modeloOnda.agregarOndaExtra(x, y);
  };

  useEffect(() => {
    if (!app) return;

    // Setup Render Layers
    const capaOndas = new PIXI.Graphics();
    
    // Aplicar filtro de Bloom para el efecto neón
    const bloomFilter = new AdvancedBloomFilter({
      threshold: 0.1,
      bloomScale: 1.5,
      brightness: 1.2,
      blur: 4
    });
    capaOndas.filters = [bloomFilter];
    
    app.stage.addChild(capaOndas);

    // En PixiJS 8 un ParticleContainer solo admite objetos Particle (addParticle),
    // todos con la misma fuente de textura: una sola textura blanca y color por tint.
    const contenedorParticulas = new PIXI.ParticleContainer({ dynamicProperties: { position: true } });
    app.stage.addChild(contenedorParticulas);

    const particulas = sistemaParticulas.getParticulas();
    const particulasPixi: PIXI.Particle[] = [];

    const canvasP = document.createElement('canvas');
    canvasP.width = 12; canvasP.height = 12;
    const ctxP = canvasP.getContext('2d')!;
    const gradP = ctxP.createRadialGradient(6, 6, 1, 6, 6, 5);
    gradP.addColorStop(0, '#ffffff'); gradP.addColorStop(1, '#94a3b8');
    ctxP.fillStyle = gradP; ctxP.beginPath(); ctxP.arc(6, 6, 5, 0, Math.PI * 2); ctxP.fill();
    const texturaParticula = PIXI.Texture.from(canvasP);

    particulas.forEach(p => {
      const particula = new PIXI.Particle({
        texture: texturaParticula,
        x: p.xActual,
        y: p.yActual,
        anchorX: 0.5,
        anchorY: 0.5,
        tint: p.esRoja ? 0xef4444 : 0xcbd5e1,
      });
      contenedorParticulas.addParticle(particula);
      particulasPixi.push(particula);
    });

    // Update loop
    const ticker = (t: PIXI.Ticker) => {
      if (store.isPaused) return;

      const tiempoDelta = t.deltaMS / 1000;
      const factorVelocidad = store.timeScale === 'lento' ? 0.2 : 1.0;

      modeloOnda.actualizar(tiempoDelta, factorVelocidad);
      sistemaParticulas.actualizar();

      // Render Particles
      if (store.viewMode === 'particulas' || store.viewMode === 'ambos') {
        contenedorParticulas.visible = true;
        particulas.forEach((p, i) => {
          particulasPixi[i].x = p.xActual;
          particulasPixi[i].y = p.yActual;
        });
      } else {
        contenedorParticulas.visible = false;
      }

      // Render Waves
      capaOndas.clear();
      if (store.viewMode === 'ondas' || store.viewMode === 'ambos') {
        // Onda Principal
        for (let r = 0; r < 900; r += 8) {
          const presion = modeloOnda.getPresionEn(r);
          const factor = Math.max(0, Math.min(1, (presion + 100) / 200));

          let color = 0x0ea5e9; // default cyan
          if (store.waveColor === 'magenta') color = 0xd946ef;
          else if (store.waveColor === 'green') color = 0x22c55e;

          // Mezclar el color base con la intensidad de la presión
          const [r255, g255, b255] = new PIXI.Color(color).toUint8RgbArray();
          const colorFinal = new PIXI.Color([r255 * factor / 255, g255 * factor / 255, b255 * factor / 255]).toNumber();

          capaOndas.circle(0, 200, r).stroke({ width: 8, color: colorFinal, alpha: 0.6 });

          if (store.isInterferenceMode) {
             // Dibujar segunda onda offseteada
             capaOndas.circle(0, 100, r).stroke({ width: 8, color: colorFinal, alpha: 0.4 });
          }
        }

        // Ondas Interactivas (Clics)
        modeloOnda.ondasExtra.forEach(onda => {
          const tiempoActivo = modeloOnda.tiempo - onda.tiempoInicio;
          const radio = tiempoActivo * modeloOnda.velocidad;
          if (radio > 0 && radio < 1500) {
            // Ancho del pulso simulado
            capaOndas.circle(onda.x, onda.y, radio).stroke({ width: 10, color: 0x0ea5e9, alpha: Math.max(0, 1 - radio / 500) });
          }
        });
      }
    };

    app.ticker.add(ticker);

    return () => {
      app.ticker.remove(ticker);
      // Si el efecto se vuelve a ejecutar (cambia el store) no se acumulan capas.
      app.stage.removeChild(capaOndas);
      app.stage.removeChild(contenedorParticulas);
      capaOndas.destroy();
      contenedorParticulas.destroy();
      texturaParticula.destroy(true);
    };
  }, [app, modeloOnda, sistemaParticulas, store.viewMode, store.timeScale, store.isPaused, store.waveColor, store.sourceVelocity]);

  return (
    <div className="flex justify-center items-center p-4">
      <div 
        ref={containerRef} 
        onClick={handleCanvasClick}
        className="rounded-xl overflow-hidden border border-gray-700 shadow-[0_0_30px_rgba(59,130,246,0.15)] bg-gray-950 w-[800px] h-[400px] cursor-crosshair transition-shadow hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
      />
    </div>
  );
};
