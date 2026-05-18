export class ControladorInterfaz {
    constructor(modeloOnda, gestorAudio, motorSimulacion, renderizador) {
        this.modeloOnda = modeloOnda;
        this.gestorAudio = gestorAudio;
        this.motorSimulacion = motorSimulacion;
        this.renderizador = renderizador;
        this.configurarEventos();
        this.actualizarPanelInfo();
    }

    configurarEventos() {
        const sliderFrecuencia = document.getElementById('sliderFrecuencia');
        const valorFrecuencia = document.getElementById('valorFrecuencia');
        
        sliderFrecuencia.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            this.modeloOnda.setFrecuencia(val);
            this.gestorAudio.setFrecuencia(val * 100); 
            valorFrecuencia.innerText = val.toFixed(1);
            this.actualizarPanelInfo();
            
            // Animación GSAP al cambiar valor
            gsap.fromTo(valorFrecuencia, { scale: 1.3 }, { scale: 1, duration: 0.2 });
        });

        const sliderAmplitud = document.getElementById('sliderAmplitud');
        const valorAmplitud = document.getElementById('valorAmplitud');

        sliderAmplitud.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            this.modeloOnda.setAmplitud(val);
            this.gestorAudio.setVolumen(val / 100);
            valorAmplitud.innerText = val.toString();
            
            gsap.fromTo(valorAmplitud, { scale: 1.3 }, { scale: 1, duration: 0.2 });
        });

        const checkSonido = document.getElementById('checkSonido');
        checkSonido.addEventListener('change', (e) => {
            const checked = e.target.checked;
            if (checked) {
                this.gestorAudio.iniciarTono(parseFloat(sliderFrecuencia.value) * 100);
            } else {
                this.gestorAudio.detenerTono();
            }
        });

        const btnPlayPause = document.getElementById('btnPlayPause');
        const txtEstado = document.getElementById('txtEstado');
        
        btnPlayPause.addEventListener('click', () => {
            const icono = btnPlayPause.querySelector('i');
            const texto = btnPlayPause.querySelector('span');

            if (this.motorSimulacion.estaCorriendo) {
                this.motorSimulacion.detener();
                texto.innerText = 'Reanudar';
                icono.className = 'fas fa-play';
                txtEstado.innerText = 'Pausado';
                txtEstado.style.color = '#ef4444';
            } else {
                this.motorSimulacion.iniciar();
                texto.innerText = 'Pausar';
                icono.className = 'fas fa-pause';
                txtEstado.innerText = 'Emitiendo';
                txtEstado.style.color = '#0ea5e9';
            }
            
            gsap.from(btnPlayPause, { scale: 0.95, duration: 0.1 });
        });

        const checkGraficas = document.getElementById('checkGraficas');
        checkGraficas.addEventListener('change', (e) => {
            this.renderizador.setMostrarGrafica(e.target.checked);
        });

        const radiosModoVista = document.querySelectorAll('input[name="modoVista"]');
        radiosModoVista.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const valor = e.target.value;
                if (valor === 'ondas') {
                    this.renderizador.setOpcionesVisualizacion(true, false);
                } else if (valor === 'particulas') {
                    this.renderizador.setOpcionesVisualizacion(false, true);
                } else if (valor === 'ambos') {
                    this.renderizador.setOpcionesVisualizacion(true, true);
                }
            });
        });

        const radiosModoEmision = document.querySelectorAll('input[name="modoEmision"]');
        radiosModoEmision.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.modeloOnda.setModo(e.target.value);
                if (e.target.value === 'pulso') {
                    txtEstado.innerText = 'Pulso Único';
                } else {
                    txtEstado.innerText = 'Emitiendo';
                }
            });
        });
    }

    actualizarPanelInfo() {
        const txtLongitud = document.getElementById('txtLongitud');
        const txtPeriodo = document.getElementById('txtPeriodo');
        
        if (txtLongitud && txtPeriodo) {
            const longitud = this.modeloOnda.longitudOnda;
            const periodo = 1 / this.modeloOnda.frecuencia;
            
            txtLongitud.innerText = `${longitud.toFixed(1)} cm`;
            txtPeriodo.innerText = `${periodo.toFixed(2)} s`;

            // Animación GSAP para feedback visual de actualización
            gsap.fromTo([txtLongitud, txtPeriodo], 
                { color: '#ffffff' }, 
                { color: '#0ea5e9', duration: 0.5 }
            );
        }
    }
}
