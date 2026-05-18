export class SistemaParticulas {
    constructor(modeloOnda, ancho, alto, espaciado) {
        this.modeloOnda = modeloOnda;
        this.particulas = [];
        this.inicializarParticulas(ancho, alto, espaciado);
    }

    inicializarParticulas(ancho, alto, espaciado) {
        const xFuente = 0;
        const yFuente = 200; // Centro vertical

        for (let x = 0; x < ancho; x += espaciado) {
            for (let y = 0; y < alto; y += espaciado) {
                // 1. DISTRIBUCIÓN ALEATORIA (Para que no parezca una cuadrícula artificial)
                const xAleatorio = x + (Math.random() - 0.5) * espaciado * 1.5;
                const yAleatorio = y + (Math.random() - 0.5) * espaciado * 1.5;

                // 2. CÁLCULO DE DIRECCIÓN RADIAL
                const dx = xAleatorio - xFuente;
                const dy = yAleatorio - yFuente;
                const distancia = Math.sqrt(dx * dx + dy * dy);

                // Vector unitario de dirección
                const dirX = distancia > 0 ? dx / distancia : 1;
                const dirY = distancia > 0 ? dy / distancia : 0;

                this.particulas.push({
                    xOriginal: xAleatorio,
                    yOriginal: yAleatorio,
                    xActual: xAleatorio,
                    yActual: yAleatorio,
                    distanciaOriginal: distancia,
                    dirX: dirX,
                    dirY: dirY
                });
            }
        }
    }

    actualizar() {
        for (const p of this.particulas) {
            // El desplazamiento se calcula en base a la distancia radial original
            const desplazamiento = this.modeloOnda.getDesplazamientoEn(p.distanciaOriginal);
            
            // 3. MOVIMIENTO EN DIRECCIÓN CIRCULAR/RADIAL
            p.xActual = p.xOriginal + desplazamiento * p.dirX;
            p.yActual = p.yOriginal + desplazamiento * p.dirY;
        }
    }

    getParticulas() {
        return this.particulas;
    }
}
