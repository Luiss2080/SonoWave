export interface Emision {
  tiempo: number;
  presion: number;
  desplazamiento: number;
}

/**
 * Modelo físico que simula la propagación de ondas sonoras en 2D.
 * Utiliza memoria de historiales de emisión para calcular el retraso
 * de la onda en base a la distancia y la velocidad del medio.
 */
export class ModeloOnda {
  public amplitud: number = 50;
  public frecuencia: number = 2;
  public velocidad: number = 200; // Velocidad base del medio (px/s)
  public tiempo: number = 0;
  public modo: 'continuo' | 'pulso' = 'continuo';
  public tiempoInicioPulso: number = 0;
  public factorAmortiguacion: number = 0.99; // Damping (pérdida de energía)
  public modoInterferencia: boolean = false; // Dos fuentes
  private historialEmisiones: Emision[] = [];
  public ondasExtra: { x: number, y: number, tiempoInicio: number }[] = [];

  /**
   * Cambia la velocidad de propagación de la onda (determinado por el medio).
   * @param {number} v - Nueva velocidad en píxeles por segundo.
   */
  setVelocidad(v: number) {
      this.velocidad = v;
  }

  /**
   * Registra un pulso extra generado por la interacción del usuario en el canvas.
   * @param {number} x - Posición en X del pulso.
   * @param {number} y - Posición en Y del pulso.
   */
  agregarOndaExtra(x: number, y: number) {
      this.ondasExtra.push({ x, y, tiempoInicio: this.tiempo });
  }

  /**
   * Avanza el tiempo de la simulación y genera nuevas presiones en la fuente.
   * @param {number} tiempoDelta - Segundos transcurridos desde el último frame.
   * @param {number} factorVelocidad - Multiplicador de tiempo (para cámara lenta).
   */
  actualizar(tiempoDelta: number, factorVelocidad: number = 1) {
      this.tiempo += tiempoDelta * factorVelocidad;

      let presionEmitida = 0;
      let desplazamientoEmitido = 0;

      if (this.modo === 'continuo') {
          presionEmitida = Math.sin(2 * Math.PI * this.frecuencia * this.tiempo) * this.amplitud;
          desplazamientoEmitido = Math.cos(2 * Math.PI * this.frecuencia * this.tiempo) * this.amplitud;
      } else if (this.modo === 'pulso') {
          const tiempoDesdePulso = this.tiempo - this.tiempoInicioPulso;
          const anchoPulso = 0.5;
          if (tiempoDesdePulso < anchoPulso) {
              const envolvente = Math.exp(-Math.pow((tiempoDesdePulso - anchoPulso/2) * 4, 2));
              presionEmitida = Math.sin(2 * Math.PI * this.frecuencia * tiempoDesdePulso) * this.amplitud * envolvente;
              desplazamientoEmitido = presionEmitida;
          }
      }

      this.historialEmisiones.push({
          tiempo: this.tiempo,
          presion: presionEmitida,
          desplazamiento: desplazamientoEmitido
      });

      // Limpiar historial viejo para evitar fugas de memoria
      const tiempoLimite = this.tiempo - 5;
      while (this.historialEmisiones.length > 0 && this.historialEmisiones[0].tiempo < tiempoLimite) {
          this.historialEmisiones.shift();
      }

      // Limpiar ondas interactivas que ya se expandieron demasiado (más de 3 seg)
      this.ondasExtra = this.ondasExtra.filter(o => this.tiempo - o.tiempoInicio < 3);
  }

  setFrecuencia(f: number) {
      this.frecuencia = f;
  }

  setAmplitud(a: number) {
      this.amplitud = a;
  }

  setModo(m: 'continuo' | 'pulso') {
      if (this.modo !== m) {
          this.modo = m;
          if (m === 'pulso') {
              this.tiempoInicioPulso = this.tiempo;
          }
      }
  }

  dispararPulso() {
      if (this.modo === 'pulso') {
          this.tiempoInicioPulso = this.tiempo;
      }
  }

  /**
   * Calcula la presión sonora acumulada en una distancia específica desde el centro (fuente principal).
   * Tiene en cuenta la amortiguación matemática por distancia.
   * @param {number} distancia - Distancia radial en píxeles.
   * @returns {number} Presión calculada.
   */
  getPresionEn(distancia: number): number {
      const tiempoRetraso = distancia / this.velocidad;
      const tiempoOnda = this.tiempo - tiempoRetraso;
      let presion = this._getValorHistorial(tiempoOnda, 'presion');
      
      // Aplicar atenuación / amortiguación a mayor distancia
      const atenuacion = Math.pow(this.factorAmortiguacion, distancia / 50);
      
      if (this.modoInterferencia) {
          // Si la interferencia está activa, sumamos una onda fantasma desplazada verticalmente
          const distanciaFuente2 = Math.abs(distancia - 100); 
          const tiempoRetraso2 = distanciaFuente2 / this.velocidad;
          const tiempoOnda2 = this.tiempo - tiempoRetraso2;
          const presion2 = this._getValorHistorial(tiempoOnda2, 'presion');
          presion = (presion + presion2) / 2; // Superposición simple 1D para el canvas radial
      }

      return presion * atenuacion;
  }

  getDesplazamientoEn(distancia: number): number {
      const tiempoRetraso = distancia / this.velocidad;
      const tiempoOnda = this.tiempo - tiempoRetraso;
      const desp = this._getValorHistorial(tiempoOnda, 'desplazamiento');
      const atenuacion = Math.pow(this.factorAmortiguacion, distancia / 50);
      return desp * atenuacion;
  }

  /**
   * Busca linealmente en el historial de emisiones el valor más cercano al tiempo solicitado.
   * @private
   */
  private _getValorHistorial(tiempoObjetivo: number, propiedad: 'presion' | 'desplazamiento'): number {
      if (this.historialEmisiones.length === 0 || tiempoObjetivo < this.historialEmisiones[0].tiempo) {
          return 0;
      }

      for (let i = this.historialEmisiones.length - 1; i >= 0; i--) {
          if (this.historialEmisiones[i].tiempo <= tiempoObjetivo) {
              return this.historialEmisiones[i][propiedad];
          }
      }
      return 0;
  }
}
