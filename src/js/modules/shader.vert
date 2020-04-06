varying vec2 vUv;
uniform vec2 u_size;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
varying vec4 vPosition;
uniform float waveLength;
uniform float ratio;

void main() {
  // растягивает изоюражение на весь экран
  vUv = uv;

  lowp float vWave = sin(u_time / 4.0 + (position.x + position.y) * waveLength);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x - u_mouse.y * 0.02, position.y + u_mouse.x * 0.02, vWave * 0.04, 1.0);

  // сохранет пропорции изображения
  // gl_Position = vec4(position, 1.0);
}

