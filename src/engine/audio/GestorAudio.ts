/**
 * Gestor de Audio basado en la API Web Audio nativa.
 * Permite reproducir tonos puros o formas de onda complejas.
 */
export class GestorAudio {
  private contextoAudio: AudioContext | null = null;
  private oscilador: OscillatorNode | null = null;
  private nodoGanancia: GainNode | null = null;
  private estaReproduciendo: boolean = false;
  /** true si la creación del AudioContext falló (API no soportada, bloqueada, etc.). */
  private audioNoDisponible: boolean = false;

  /**
   * Indica si el audio está disponible en este navegador/contexto.
   * Útil para que la UI pueda deshabilitar o avisar sobre el control de sonido.
   */
  estaDisponible(): boolean {
      return !this.audioNoDisponible;
  }

  /**
   * Inicializa el contexto de audio y sus nodos principales.
   * Por políticas del navegador, esto solo debe llamarse tras una interacción del usuario.
   * Si la Web Audio API no está disponible o su creación falla (navegador sin soporte,
   * política de autoplay, contexto ya agotado, etc.), falla de forma segura: marca el
   * audio como no disponible en lugar de lanzar una excepción que rompa la UI.
   */
  inicializar() {
      if (this.contextoAudio || this.audioNoDisponible) return;

      try {
        const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextCtor) {
          throw new Error('Web Audio API no soportada en este navegador.');
        }

        this.contextoAudio = new AudioContextCtor();
        this.nodoGanancia = this.contextoAudio.createGain();
        this.nodoGanancia.connect(this.contextoAudio.destination);
        this.nodoGanancia.gain.value = 0.1;
      } catch (error) {
        console.warn('GestorAudio: no se pudo inicializar el AudioContext, el audio quedará deshabilitado.', error);
        this.contextoAudio = null;
        this.nodoGanancia = null;
        this.audioNoDisponible = true;
      }
  }

  /**
   * Inicia la reproducción de una onda de sonido continua.
   * No hace nada si el audio no está disponible (ver `estaDisponible`).
   * @param {number} frecuencia - Frecuencia del oscilador en Hz (tono).
   * @param {OscillatorType} tipo - Forma de la onda ('sine', 'square', 'triangle', etc.).
   */
  iniciarTono(frecuencia: number, tipo: OscillatorType = 'sine') {
      if (!this.contextoAudio && !this.audioNoDisponible) this.inicializar();
      if (!this.contextoAudio || !this.nodoGanancia) return;
      if (this.estaReproduciendo) return;

      try {
        this.oscilador = this.contextoAudio.createOscillator();
        this.oscilador.type = tipo;
        this.oscilador.frequency.value = frecuencia;

        this.oscilador.connect(this.nodoGanancia);
        this.oscilador.start();
        this.estaReproduciendo = true;
      } catch (error) {
        console.warn('GestorAudio: no se pudo iniciar el tono.', error);
        this.oscilador = null;
        this.estaReproduciendo = false;
      }
  }

  /**
   * Detiene el oscilador abruptamente de forma segura.
   */
  detenerTono() {
      if (this.oscilador && this.estaReproduciendo) {
          this.oscilador.stop();
          this.oscilador.disconnect();
          this.oscilador = null;
          this.estaReproduciendo = false;
      }
  }

  /**
   * Interpola suavemente la frecuencia hacia un nuevo valor usando setTargetAtTime.
   * @param {number} frecuencia - Nueva frecuencia deseada.
   */
  setFrecuencia(frecuencia: number) {
      if (this.oscilador && this.contextoAudio) {
          this.oscilador.frequency.setTargetAtTime(frecuencia, this.contextoAudio.currentTime, 0.01);
      }
  }

  /**
   * Cambia el timbre del sonido.
   * @param {OscillatorType} tipo - La nueva forma de onda.
   */
  setTipoOnda(tipo: OscillatorType) {
      if (this.oscilador) {
          this.oscilador.type = tipo;
      }
  }

  /**
   * Ajusta el volumen general (amplitud acústica).
   * @param {number} volumen - Rango de 0.0 (silencio) a 1.0 (máximo).
   */
  setVolumen(volumen: number) {
      if (this.nodoGanancia && this.contextoAudio) {
          this.nodoGanancia.gain.setTargetAtTime(volumen, this.contextoAudio.currentTime, 0.01);
      }
  }
}
