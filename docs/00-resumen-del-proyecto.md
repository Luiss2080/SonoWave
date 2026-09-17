# 00. Resumen del Proyecto: SonoWave (antes "Simulador de Ondas Sonoras")

## Introducción
Este proyecto consiste en el diseño y documentación de un simulador interactivo de ondas sonoras en el navegador, inspirado en el módulo "Ondas: Intro" de PhET. El objetivo es proporcionar una herramienta educativa visual y auditiva de alto rendimiento (60 FPS) que permita comprender el comportamiento de las ondas mecánicas longitudinales (sonido) a través de la manipulación de variables físicas como la frecuencia y la amplitud.

## Objetivos del Simulador
- **Visualización en tiempo real:** Representar el movimiento de las partículas de aire y la propagación de la onda sonora.
- **Interacción dinámica:** Permitir al usuario cambiar frecuencia y amplitud y ver/escuchar el efecto inmediatamente.
- **Multimodalidad:** Ofrecer representaciones visuales (ondas, partículas o ambas) y auditivas (sonido generado por la Web Audio API).
- **Rendimiento:** Asegurar una experiencia fluida a 60 FPS mediante el uso optimizado de HTML5 Canvas.

## Desarrollo y Alcance
El proyecto se divide en 13 fases de desarrollo, desde la configuración inicial hasta el despliegue. Se ha priorizado una arquitectura limpia y eficiente (Vanilla JS/TS) para evitar sobrecargas y garantizar que el simulador funcione de manera óptima incluso en dispositivos menos potentes.

### Características Clave
- **Motor de Animación:** Basado en `requestAnimationFrame` con cálculo de *delta time* para consistencia.
- **Modelo de Partículas:** Simulación de movimiento longitudinal realista.
- **Renderizado Eficiente:** Uso de Canvas 2D con optimizaciones como doble buffer y bitmap caching.
- **Audio Sincronizado:** Generación de tonos que corresponden a la frecuencia visualizada.

## Buenas Prácticas
- **Modularidad:** Cada componente del sistema (física, render, audio, UI) está desacoplado.
- **Legibilidad:** Código documentado y tipado con TypeScript.
- **Eficiencia:** Evitar fugas de memoria y cálculos redundantes en el bucle de animación.

## Conclusión
Este simulador representa un equilibrio entre precisión pedagógica y rendimiento técnico. Al seguir esta documentación, un desarrollador podrá construir una herramienta robusta y escalable que sirve tanto para el aprendizaje como para la demostración de conceptos físicos complejos.
