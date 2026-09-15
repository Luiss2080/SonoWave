import { useSimulationEngine } from '../hooks/useSimulationEngine';
import { useStore } from '../store/useStore';
import * as PIXI from 'pixi.js';
import { AdvancedBloomFilter } from 'pixi-filters';

export const SimulationCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { modeloOnda, sistemaParticulas, app } = useSimulationEngine(containerRef);
  const store = useStore();

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

    const contenedorParticulas = new PIXI.ParticleContainer(3000, { position: true });
    app.stage.addChild(contenedorParticulas);

    const spritesParticulas: PIXI.Sprite[] = [];
    const particulas = sistemaParticulas.getParticulas();

    // Create Textures
    const canvasB = document.createElement('canvas');
    canvasB.width = 12; canvasB.height = 12;
    const ctxB = canvasB.getContext('2d')!;
    const gradB = ctxB.createRadialGradient(6,6,1,6,6,5);
    gradB.addColorStop(0, '#ffffff'); gradB.addColorStop(1, '#64748b');
    ctxB.fillStyle = gradB; ctxB.beginPath(); ctxB.arc(6,6,5,0,Math.PI*2); ctxB.fill();
    const texB = PIXI.Texture.from(canvasB);

    const canvasR = document.createElement('canvas');
    canvasR.width = 12; canvasR.height = 12;
    const ctxR = canvasR.getContext('2d')!;
    const gradR = ctxR.createRadialGradient(6,6,1,6,6,5);
    gradR.addColorStop(0, '#ff8787'); gradR.addColorStop(1, '#b91c1c');
    ctxR.fillStyle = gradR; ctxR.beginPath(); ctxR.arc(6,6,5,0,Math.PI*2); ctxR.fill();
    const texR = PIXI.Texture.from(canvasR);

    particulas.forEach(p => {
      const sprite = new PIXI.Sprite(p.esRoja ? texR : texB);
      sprite.anchor.set(0.5);
      contenedorParticulas.addChild(sprite);
      spritesParticulas.push(sprite);
    });

    // Update loop
    const ticker = (delta: number) => {
      const timeDelta = (delta / 60) * (store.timeScale === 'lento' ? 0.2 : 1);
      modeloOnda.actualizar(timeDelta);
      sistemaParticulas.actualizar();

      // Render Particles
      if (store.viewMode === 'particulas' || store.viewMode === 'ambos') {
        contenedorParticulas.visible = true;
        particulas.forEach((p, i) => {
          spritesParticulas[i].x = p.xActual;
          spritesParticulas[i].y = p.yActual;
        });
      } else {
        contenedorParticulas.visible = false;
      }

      // Render Waves
      capaOndas.clear();
      if (store.viewMode === 'ondas' || store.viewMode === 'ambos') {
        for (let r = 0; r < 900; r += 8) {
          const presion = modeloOnda.getPresionEn(r);
          const factor = (presion + 100) / 200;
          const valorGris = Math.floor(Math.max(0, Math.min(1, factor)) * 255);
          const color = (valorGris << 16) | (valorGris << 8) | valorGris;
          
          capaOndas.lineStyle(8, color, 0.6);
          capaOndas.drawCircle(0, 200, r);
        }
      }
    };

    app.ticker.add(ticker);

    return () => {
      app.ticker.remove(ticker);
    };
  }, [app, modeloOnda, sistemaParticulas, store.viewMode, store.timeScale]);

  return (
    <div className="flex justify-center items-center p-4">
      <div 
        ref={containerRef} 
        className="rounded-xl overflow-hidden border border-gray-700 shadow-2xl bg-gray-950 w-[800px] h-[400px]"
      />
    </div>
  );
};
