interface Emision {
  tiempo: number;
  presion: number;
  desplazamiento: number;
}

export class ModeloOnda {
  public amplitud: number = 50;
  public frecuencia: number = 2;
  public velocidad: number = 200;
  public tiempo: number = 0;
  public modo: 'continuo' | 'pulso' = 'continuo';
  public tiempoInicioPulso: number = 0;
  private historialEmisiones: Emision[] = [];

  actualizar(tiempoDelta: number, factorVelocidad: number = 1) {
      this.tiempo += tiempoDelta * factorVelocidad;
      
      let presionEmitida = 0;
      let desplazamientoEmitido = 0;
      const omega = 2 * Math.PI * this.frecuencia;

      if (this.modo === 'continuo') {
          presionEmitida = this.amplitud * Math.sin(omega * this.tiempo);
          desplazamientoEmitido = this.amplitud * Math.cos(omega * this.tiempo);
      } else {
          const tRelativo = this.tiempo - this.tiempoInicioPulso;
          const anchoPulso = 0.2;
          const factor = Math.exp(-Math.pow(tRelativo / anchoPulso, 2));
          presionEmitida = this.amplitud * factor;
          desplazamientoEmitido = this.amplitud * factor;
      }

      this.historialEmisiones.push({
          tiempo: this.tiempo,
          presion: presionEmitida,
          desplazamiento: desplazamientoEmitido
      });

      const tiempoLimite = this.tiempo - 5;
      while (this.historialEmisiones.length > 0 && this.historialEmisiones[0].tiempo < tiempoLimite) {
          this.historialEmisiones.shift();
      }
  }

  setFrecuencia(f: number) {
      this.frecuencia = f;
  }

  setAmplitud(a: number) {
      this.amplitud = a;
  }

  setModo(modo: 'continuo' | 'pulso') {
      this.modo = modo;
      if (modo === 'pulso') {
          this.tiempoInicioPulso = this.tiempo;
      }
  }

  get omega(): number {
      return 2 * Math.PI * this.frecuencia;
  }

  getPresionEn(x: number): number {
      const tiempoRetraso = x / this.velocidad;
      const tiempoObjetivo = this.tiempo - tiempoRetraso;
      return this.obtenerValorHistorial(tiempoObjetivo, 'presion');
  }

  getDesplazamientoEn(x: number): number {
      const tiempoRetraso = x / this.velocidad;
      const tiempoObjetivo = this.tiempo - tiempoRetraso;
      return this.obtenerValorHistorial(tiempoObjetivo, 'desplazamiento');
  }

  private obtenerValorHistorial(tiempoObjetivo: number, propiedad: 'presion' | 'desplazamiento'): number {
      if (this.historialEmisiones.length === 0) return 0;

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
      
      const index = Math.min(Math.max(min, 0), this.historialEmisiones.length - 1);
      return this.historialEmisiones[index][propiedad];
  }
}
