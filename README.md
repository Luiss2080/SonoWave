<div align="center">
  
# 🌊 Simulador de Ondas Pro (Edición Definitiva)

[![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PixiJS](https://img.shields.io/badge/PixiJS-8-ff007f.svg?style=for-the-badge&logo=webgl)](https://pixijs.com/)
[![Zustand](https://img.shields.io/badge/Zustand-4-brown.svg?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![Vitest](https://img.shields.io/badge/Vitest-5-yellow.svg?style=for-the-badge&logo=vitest)](https://vitest.dev/)

**Una experiencia interactiva y cinemática para aprender física acústica en tu navegador.**

[Explorar Funcionalidades](#-características-principales) • [Instalación](#-instalación-y-uso) • [Arquitectura](#%EF%B8%8F-arquitectura-técnica) • [Testing](#-testing-y-qa)

</div>

---

## 📖 Introducción

El **Simulador de Ondas Pro** es un laboratorio virtual avanzado construido bajo el estándar *Spec-Driven Development*. Permite a estudiantes, profesores y curiosos visualizar la propagación de ondas sonoras en tiempo real, interactuar con el medio físico, escuchar las frecuencias exactas a través de osciladores web y estudiar patrones complejos como la interferencia o el efecto Doppler. Todo ello envuelto en una deslumbrante interfaz *Glassmorphism* y renderizado acelerado por hardware (WebGL).

---

## ✨ Características Principales

### 🔬 Motor Físico Avanzado
- **Propagación 2D:** Visualiza frentes de onda interactuando con el medio de forma matemática.
- **Principio de Superposición (Interferencia):** Activa el modo de doble emisor para ver patrones de Moiré (interferencia constructiva y destructiva).
- **Amortiguación (Damping):** Pérdida realista de energía según la distancia radial de la fuente.
- **Medios Variables:** Cambia entre Aire (343 m/s), Agua (1480 m/s) y Acero (5000 m/s) para alterar dramáticamente las longitudes de onda.

### 🎮 Gamificación y UI
- **HUD de Estadísticas (Métricas):** Un panel flotante estilo Sci-Fi muestra los FPS en tiempo real, el estado del motor y longitudes de onda calculadas.
- **Sistema de Misiones:** Paneles laterales interactivos que guían al usuario para descubrir características ("Sube el volumen", "Cambia la frecuencia").
- **Diseño Glassmorphism:** Menús translúcidos, desenfoques de fondo y animaciones 3D fluidas cortesía de *Framer Motion*.
- **Snapshots PNG:** ¿Descubriste un patrón increíble? Descarga la imagen en alta resolución con un solo clic.

### 🎧 Audio Sintético
- **Web Audio API:** La gráfica no es solo visual, se traduce matemáticamente a un `OscillatorNode` que genera un tono puro sincronizado.
- **Timbre:** Elige entre ondas *Senoidales*, *Cuadradas* o *Triangulares* y escucha el cambio en el espectro armónico.

---

## 🚀 Instalación y Uso

Asegúrate de tener [Node.js](https://nodejs.org/) instalado en tu sistema (v16+).

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/simulador-de-ondas.git

# 2. Entra al directorio
cd simulador-de-ondas

# 3. Instala las dependencias
npm install

# 4. Inicia el servidor de desarrollo ultrarrápido (Vite)
npm run dev
```
> Abre tu navegador en `http://localhost:5173` y disfruta de la simulación.

---

## 🛠️ Arquitectura Técnica

El simulador fue construido con un enfoque estricto en el rendimiento, separando el hilo de la Interfaz (React) del Renderizado Gráfico (PixiJS).

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Núcleo Lógico** | TypeScript Puro | Clases matemáticas que manejan la física (`ModeloOnda.ts`) y manipulan el `AudioContext`. |
| **Estado Global** | Zustand | Almacén inmutable ultrarrápido (`useStore.ts`) que conecta los menús de React sin forzar re-renderizados innecesarios. |
| **Renderizado 2D/3D** | PixiJS (WebGL) | Renderiza miles de partículas y aplica filtros complejos (*AdvancedBloomFilter*) a 60 FPS constantes en `SimulationCanvas.tsx`. |
| **Componentes UI** | React + Tailwind | Interfaz declarativa, responsiva y sumamente atractiva (botones de neón, tooltips). |
| **Animaciones UI** | Framer Motion | Gestos y transiciones físicas fluidas en los modales y barras laterales. |

---

## 🧪 Testing y QA

El proyecto cuenta con una cobertura integral de pruebas impulsada por **Vitest** y **React Testing Library**.

Para correr la suite de pruebas (Unitarias y DOM), ejecuta:
```bash
npm run test
```

### ¿Qué se testea?
1. **Motor Físico (`ModeloOnda.test.ts`):** Valida los cálculos de atenuación, avance temporal continuo y desintegración de ondas extras.
2. **Máquina de Estados (`useStore.test.ts`):** Garantiza que todos los reducers (Pausar, Resetear, cambiar modo de Interferencia) sean puros.
3. **UI y Componentes (`Controls.test.tsx`):** Simula clics (JSDOM) y valida que el entorno de React reacciona sin romper el ciclo de vida, burlando de forma segura las APIs de Canvas y AudioContext.

---

<div align="center">
  <p>Construido con ❤️ y mucha física.</p>
</div>
