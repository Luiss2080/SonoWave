export class GestorAudio {
  contextoAudio: AudioContext | null = null;
  oscilador: OscillatorNode | null = null;
  nodoGanancia: GainNode | null = null;
  estaReproduciendo: boolean = false;

  inicializar() {
      this.contextoAudio = new AudioContext();
      this.nodoGanancia = this.contextoAudio.createGain();
      this.nodoGanancia.connect(this.contextoAudio.destination);
      this.nodoGanancia.gain.value = 0.1;
  }

  iniciarTono(frecuencia: number) {
      if (!this.contextoAudio) this.inicializar();
      if (this.estaReproduciendo) return;
      
      this.oscilador = this.contextoAudio!.createOscillator();
      this.oscilador.type = 'sine';
      this.oscilador.frequency.value = frecuencia;
      
      this.oscilador.connect(this.nodoGanancia!);
      this.oscilador.start();
      this.estaReproduciendo = true;
  }

  detenerTono() {
      if (!this.estaReproduciendo || !this.oscilador) return;
      this.oscilador.stop();
      this.oscilador.disconnect();
      this.estaReproduciendo = false;
  }

  setFrecuencia(frecuencia: number) {
      if (this.oscilador && this.contextoAudio) {
          this.oscilador.frequency.setTargetAtTime(frecuencia, this.contextoAudio.currentTime, 0.01);
      }
  }

  setVolumen(volumen: number) {
      if (this.nodoGanancia && this.contextoAudio) {
          this.nodoGanancia.gain.setTargetAtTime(volumen, this.contextoAudio.currentTime, 0.01);
      }
  }
}
