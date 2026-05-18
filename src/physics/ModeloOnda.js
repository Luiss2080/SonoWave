export class ModeloOnda {
    constructor() {
        this.amplitud = 50; // En unidades visuales
        this.frecuencia = 2; // En Hz
        this.velocidad = 200; // Velocidad visual en pixeles/segundo (ajustada para que coincida con el delay)
        this.tiempo = 0;
        this.modo = 'continuo'; // 'continuo' o 'pulso'
        this.tiempoInicioPulso = 0;
        
        // BUFFER DE EMISIONES: Para que los cambios se propaguen progresivamente
        this.historialEmisiones = [];
    }

    actualizar(tiempoDelta, factorVelocidad = 1) {
        this.tiempo += tiempoDelta * factorVelocidad;
        
        // Emitir el valor actual del altavoz
        let presionEmitida = 0;
        let desplazamientoEmitido = 0;
        const omega = 2 * Math.PI * this.frecuencia;

        if (this.modo === 'continuo') {
            presionEmitida = this.amplitud * Math.sin(omega * this.tiempo);
            desplazamientoEmitido = this.amplitud * Math.cos(omega * this.tiempo);
        } else {
            // Modo pulso: Un paquete de onda gaussiano
            const tRelativo = this.tiempo - this.tiempoInicioPulso;
            const anchoPulso = 0.2; // Duración del pulso en segundos
            const factor = Math.exp(-Math.pow(tRelativo / anchoPulso, 2));
            presionEmitida = this.amplitud * factor;
            desplazamientoEmitido = this.amplitud * factor;
        }

        // Guardar en el buffer
        this.historialEmisiones.push({
            tiempo: this.tiempo,
            presion: presionEmitida,
            desplazamiento: desplazamientoEmitido
        });

        // Limpiar historial viejo para no saturar la memoria
        // El canvas mide 800px. A 200px/s, la onda tarda 4 segundos en cruzar.
        // Guardamos 5 segundos de historial.
        const tiempoLimite = this.tiempo - 5;
        while (this.historialEmisiones.length > 0 && this.historialEmisiones[0].tiempo < tiempoLimite) {
            this.historialEmisiones.shift();
        }
    }

    setFrecuencia(f) {
        this.frecuencia = f;
    }

    setAmplitud(a) {
        this.amplitud = a;
    }

    setModo(modo) {
        this.modo = modo;
        if (modo === 'pulso') {
            this.tiempoInicioPulso = this.tiempo;
        }
    }

    get omega() {
        return 2 * Math.PI * this.frecuencia;
    }

    // Obtener la presión que se emitió en el pasado y que ahora llega a la distancia x
    getPresionEn(x) {
        const tiempoRetraso = x / this.velocidad;
        const tiempoObjetivo = this.tiempo - tiempoRetraso;
        
        return this.obtenerValorHistorial(tiempoObjetivo, 'presion');
    }

    getDesplazamientoEn(x) {
        const tiempoRetraso = x / this.velocidad;
        const tiempoObjetivo = this.tiempo - tiempoRetraso;
        
        return this.obtenerValorHistorial(tiempoObjetivo, 'desplazamiento');
    }

    obtenerValorHistorial(tiempoObjetivo, propiedad) {
        if (this.historialEmisiones.length === 0) return 0;

        // Búsqueda binaria para encontrar el frame más cercano al tiempo objetivo
        let min = 0;
        let max = this.historialEmisiones.length - 1;
        
        while (min <= max) {
            let mid = Math.floor((min + max) / 2);
            let t = this.historialEmisiones[mid].tiempo;
            
            if (Math.abs(t - tiempoObjetivo) < 0.01) {
                return this.historialEmisiones[mid][propiedad];
            }
            
            if (t < tiempoObjetivo) {
                min = mid + 1;
            } else {
                max = mid - 1;
            }
        }
        
        // Si no encuentra el exacto, devuelve el más cercano
        const index = Math.min(Math.max(min, 0), this.historialEmisiones.length - 1);
        return this.historialEmisiones[index][propiedad];
    }
}
