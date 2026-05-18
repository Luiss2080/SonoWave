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
                const xAleatorio = x + (Math.random() - 0.5) * espaciado * 1.5;
                const yAleatorio = y + (Math.random() - 0.5) * espaciado * 1.5;

                const dx = xAleatorio - xFuente;
                const dy = yAleatorio - yFuente;
                const distancia = Math.sqrt(dx * dx + dy * dy);

                const dirX = distancia > 0 ? dx / distancia : 1;
                const dirY = distancia > 0 ? dy / distancia : 0;

                // NUEVO: 5% de las partículas serán rojas para seguimiento (como en la imagen)
                const esRoja = Math.random() < 0.05;

                this.particulas.push({
                    xOriginal: xAleatorio,
                    yOriginal: yAleatorio,
                    xActual: xAleatorio,
                    yActual: yAleatorio,
                    distanciaOriginal: distancia,
                    dirX: dirX,
                    dirY: dirY,
                    esRoja: esRoja
                });
            }
        }
    }

    actualizar() {
        for (const p of this.particulas) {
            const desplazamiento = this.modeloOnda.getDesplazamientoEn(p.distanciaOriginal);
            
            p.xActual = p.xOriginal + desplazamiento * p.dirX;
            p.yActual = p.yOriginal + desplazamiento * p.dirY;
        }
    }

    getParticulas() {
        return this.particulas;
    }
}
