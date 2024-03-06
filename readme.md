<div align="center">
    <h1>Project-04</h1>
    <p align="center">
        Three JS Firework Shader
    </p>
    <p align="center">
      Project from Three.js Journey shaders lessons https://threejs-journey.com/lessons/fireworks-shaders
    </p>
</div>

## Goal

This project utilizes a unique approach where particles are rendered and animated entirely within the vertex shader, eliminating the need for separate geometry processing stages. This technique streamlines the rendering pipeline, potentially leading to performance improvements.

- The particles start to expand fast in every direction
- They scale up even faster
- They start to fall down slowly
- They scale down
- They twinkle as they disappear

## Setup

Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```
