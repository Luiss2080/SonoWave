/**
 * Gestor de Audio basado en la API Web Audio nativa.
 * Permite reproducir tonos puros o formas de onda complejas.
 */
export class GestorAudio {
  private contextoAudio: AudioContext | null = null;
  private oscilador: OscillatorNode | null = null;
  private nodoGanancia: GainNode | null = null;
  private estaReproduciendo: boolean = false;

  /**
   * Inicializa el contexto de audio y sus nodos principales.
   * Por políticas del navegador, esto solo debe llamarse tras una interacción del usuario.
   */
  inicializar() {
      this.contextoAudio = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.nodoGanancia = this.contextoAudio.createGain();
      this.nodoGanancia.connect(this.contextoAudio.destination);
      this.nodoGanancia.gain.value = 0.1;
  }

  /**
   * Inicia la reproducción de una onda de sonido continua.
   * @param {number} frecuencia - Frecuencia del oscilador en Hz (tono).
   * @param {OscillatorType} tipo - Forma de la onda ('sine', 'square', 'triangle', etc.).
   */
  iniciarTono(frecuencia: number, tipo: OscillatorType = 'sine') {
      if (!this.contextoAudio) this.inicializar();
      if (this.estaReproduciendo) return;
      
      this.oscilador = this.contextoAudio!.createOscillator();
      this.oscilador.type = tipo;
      this.oscilador.frequency.value = frecuencia;
      
      this.oscilador.connect(this.nodoGanancia!);
      this.oscilador.start();
      this.estaReproduciendo = true;
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
