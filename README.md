# Simulador de Ondas Sonoras PRO 🌊

Un avanzado laboratorio virtual de acústica y propagación del sonido, construido para la web moderna. Este proyecto utiliza Spec-Driven Development (SDD) para asegurar un código robusto y escalable.

## 🛠️ Arquitectura y Stack Tecnológico

El proyecto ha sido refactorizado desde Vanilla JS a una arquitectura moderna basada en componentes y gestión de estado predecible:

- **Framework:** React 18 + Vite
- **Lenguaje:** TypeScript
- **Renderizado Gráfico:** PixiJS v7 (con WebGL para 60fps) + pixi-filters
- **Animaciones UI:** Framer Motion
- **Estilos:** Tailwind CSS (diseño Glassmorphism)
- **Gestión de Estado:** Zustand
- **Iconografía:** Lucide React

## 🚀 Instalación y Desarrollo

1. **Clonar repositorio e instalar dependencias:**
   ```bash
   npm install
   ```

2. **Servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

3. **Construir para producción:**
   ```bash
   npm run build
   ```

## 🧠 Modelos Físicos (Engine)

El núcleo matemático está aislado en `src/engine/physics`.
- `ModeloOnda.ts`: Calcula la propagación de una perturbación sinusoidal o gaussiana (pulso) a través del tiempo y el espacio con memoria de historial (`historialEmisiones`).
- `SistemaParticulas.ts`: Traduce la presión de la onda al desplazamiento cinemático de `n` partículas.

El audio es generado dinámicamente mediante la API nativa de la web `AudioContext` en `GestorAudio.ts`.

## 📚 Documentación
Revisa la carpeta `/docs/MANUAL_DE_USO.md` para entender cómo interactuar con el simulador.
