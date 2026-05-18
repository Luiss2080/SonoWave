export class Renderizador {
    constructor(contenedorId) {
        const contenedor = document.getElementById(contenedorId);
        
        this.app = new PIXI.Application({
            width: 800,
            height: 400,
            backgroundColor: 0x030712,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        contenedor.appendChild(this.app.view);

        // Capa para las ondas (Fondo)
        this.capaOndas = new PIXI.Graphics();
        this.app.stage.addChild(this.capaOndas);

        // Filtro de desenfoque para ondas suaves
        const filtroDesenfoque = new PIXI.filters.BlurFilter();
        filtroDesenfoque.blur = 5; 
        this.capaOndas.filters = [filtroDesenfoque];

        // Contenedor de partículas
        this.contenedorParticulas = new PIXI.ParticleContainer(3000, {
            position: true,
            alpha: false,
            scale: false,
            rotate: false,
            uvs: false,
        });
        this.app.stage.addChild(this.contenedorParticulas);

        // Capa para el altavoz (Animación de bombeo)
        this.capaAltavoz = new PIXI.Graphics();
        this.app.stage.addChild(this.capaAltavoz);

        // Capa para la gráfica de presión (Al frente)
        this.capaGrafica = new PIXI.Graphics();
        this.app.stage.addChild(this.capaGrafica);

        // Contenedor para textos (coordenadas) - Pixi ParticleContainer no admite texto
        this.contenedorTextos = new PIXI.Container();
        this.app.stage.addChild(this.contenedorTextos);

        this.spritesParticulas = [];
        
        this.mostrarOndas = true;
        this.mostrarParticulas = true;
        this.mostrarGrafica = true;
    }

    inicializarVistaParticulas(sistemaParticulas) {
        const particulas = sistemaParticulas.getParticulas();
        
        // Textura Blanca (Normal)
        const canvasBlanco = document.createElement('canvas');
        canvasBlanco.width = 12;
        canvasBlanco.height = 12;
        const ctxB = canvasBlanco.getContext('2d');
        const gradienteB = ctxB.createRadialGradient(4, 4, 1, 6, 6, 5);
        gradienteB.addColorStop(0, '#ffffff');
        gradienteB.addColorStop(0.8, '#cbd5e1');
        gradienteB.addColorStop(1, '#64748b');
        ctxB.beginPath();
        ctxB.arc(6, 6, 5, 0, Math.PI * 2);
        ctxB.fillStyle = gradienteB;
        ctxB.fill();
        const texturaBlanca = PIXI.Texture.from(canvasBlanco);

        // Textura Roja (Seguimiento)
        const canvasRojo = document.createElement('canvas');
        canvasRojo.width = 12;
        canvasRojo.height = 12;
        const ctxR = canvasRojo.getContext('2d');
        const gradienteR = ctxR.createRadialGradient(4, 4, 1, 6, 6, 5);
        gradienteR.addColorStop(0, '#ff8787'); // Rojo claro
        gradienteR.addColorStop(0.8, '#ef4444'); // Rojo medio
        gradienteR.addColorStop(1, '#b91c1c'); // Rojo oscuro
        ctxR.beginPath();
        ctxR.arc(6, 6, 5, 0, Math.PI * 2);
        ctxR.fillStyle = gradienteR;
        ctxR.fill();
        const texturaRoja = PIXI.Texture.from(canvasRojo);

        for (const p of particulas) {
            const sprite = new PIXI.Sprite(p.esRoja ? texturaRoja : texturaBlanca);
            sprite.anchor.set(0.5);
            sprite.x = p.xActual;
            sprite.y = p.yActual;
            this.contenedorParticulas.addChild(sprite);
            this.spritesParticulas.push(sprite);
        }
    }

    actualizar(sistemaParticulas, modeloOnda) {
        const particulas = sistemaParticulas.getParticulas();
        
        // 1. Renderizar Partículas
        if (this.mostrarParticulas) {
            this.contenedorParticulas.visible = true;
            for (let i = 0; i < particulas.length; i++) {
                this.spritesParticulas[i].x = particulas[i].xActual;
                this.spritesParticulas[i].y = particulas[i].yActual;
            }
        } else {
            this.contenedorParticulas.visible = false;
        }

        // 2. Renderizar Ondas Concéntricas
        this.capaOndas.clear();
        if (this.mostrarOndas) {
            const xCentro = 0;
            const yCentro = 200;
            const resolucion = 8;
            
            for (let r = 0; r < 900; r += resolucion) {
                const presion = modeloOnda.getPresionEn(r); 
                const factor = (presion + modeloOnda.amplitud) / (modeloOnda.amplitud * 2);
                const valorGris = Math.floor(factor * 255);
                const color = (valorGris << 16) | (valorGris << 8) | valorGris;
                
                this.capaOndas.lineStyle(resolucion, color, 0.6);
                this.capaOndas.drawCircle(xCentro, yCentro, r);
            }
        }

        // 3. Renderizar Altavoz (Animación)
        this.capaAltavoz.clear();
        const xBase = 0;
        const yBase = 200;
        const oscilacion = Math.cos(modeloOnda.omega * modeloOnda.tiempo);
        const desplazamientoCono = oscilacion * (modeloOnda.amplitud / 5);
        
        this.capaAltavoz.beginFill(0x1e293b);
        this.capaAltavoz.drawRect(xBase, yBase - 40, 30, 80);
        this.capaAltavoz.endFill();

        this.capaAltavoz.beginFill(0x475569);
        this.capaAltavoz.moveTo(30, yBase - 40);
        this.capaAltavoz.lineTo(70 + desplazamientoCono, yBase - 70);
        this.capaAltavoz.lineTo(70 + desplazamientoCono, yBase + 70);
        this.capaAltavoz.lineTo(30, yBase + 40);
        this.capaAltavoz.endFill();

        this.capaAltavoz.beginFill(0x0ea5e9);
        this.capaAltavoz.drawEllipse(70 + desplazamientoCono, yBase, 5, 20);
        this.capaAltavoz.endFill();

        // 4. Renderizar Gráfica de Presión y COORDENADAS
        this.capaGrafica.clear();
        this.contenedorTextos.removeChildren(); // Limpiar textos del frame anterior
        
        if (this.mostrarGrafica) {
            const xInicio = 100;
            const yCentro = 300;
            const anchoGrafica = 600;
            const altoGrafica = 100;

            this.capaGrafica.beginFill(0x0f172a, 0.8);
            this.capaGrafica.lineStyle(1, 0x334155, 1);
            this.capaGrafica.drawRoundedRect(xInicio - 10, yCentro - 50, anchoGrafica + 20, altoGrafica, 8);
            this.capaGrafica.endFill();

            this.capaGrafica.lineStyle(1, 0x475569, 1);
            this.capaGrafica.moveTo(xInicio, yCentro);
            this.capaGrafica.lineTo(xInicio + anchoGrafica, yCentro);

            this.capaGrafica.lineStyle(2, 0x0ea5e9, 1);
            
            let primerPunto = true;
            for (let x = xInicio; x < xInicio + anchoGrafica; x++) {
                const presion = modeloOnda.getPresionEn(x);
                const y = yCentro - (presion / modeloOnda.amplitud) * 40; 
                
                if (primerPunto) {
                    this.capaGrafica.moveTo(x, y);
                    primerPunto = false;
                } else {
                    this.capaGrafica.lineTo(x, y);
                }
            }

            // DIBUJAR COORDENADAS Y MARCAS
            const estiloTexto = new PIXI.TextStyle({
                fontFamily: 'Outfit',
                fontSize: 10,
                fill: '#94a3b8',
            });

            for (let x = xInicio; x <= xInicio + anchoGrafica; x += 100) {
                // Marca en el eje
                this.capaGrafica.lineStyle(1, 0x475569, 1);
                this.capaGrafica.moveTo(x, yCentro - 5);
                this.capaGrafica.lineTo(x, yCentro + 5);
                
                // Texto de la coordenada
                const valorSimulado = (x - xInicio) / 1.2; // Escala para simular cm
                const texto = new PIXI.Text(Math.round(valorSimulado).toString(), estiloTexto);
                texto.anchor.set(0.5, 0);
                texto.x = x;
                texto.y = yCentro + 8;
                this.contenedorTextos.addChild(texto);
            }

            // Etiqueta del eje X
            const textoEje = new PIXI.Text('Posición (cm)', estiloTexto);
            textoEje.anchor.set(0.5, 0);
            textoEje.x = xInicio + anchoGrafica / 2;
            textoEje.y = yCentro + 25;
            this.contenedorTextos.addChild(textoEje);
        }
    }

    setOpcionesVisualizacion(mostrarOndas, mostrarParticulas) {
        this.mostrarOndas = mostrarOndas;
        this.mostrarParticulas = mostrarParticulas;
    }

    setMostrarGrafica(mostrar) {
        this.mostrarGrafica = mostrar;
    }
}
