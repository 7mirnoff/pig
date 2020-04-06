varying vec2 vUv;
varying vec4 vPosition;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D texture;
uniform sampler2D map;
uniform float u_animation;
uniform float ratio;

uniform float waveLength;

void main() {
  vec2 pos = 7.68 * (gl_FragCoord.xy / u_resolution.xy - vec2(0.5, 1.0)) - vec2(u_mouse.x, -15.0);
  vec2 i = pos;

  float c = 0.0;

  for (int n = 0; n < 4; n++) {
    float t = (1.0 - (10.0 / float(n + 10))) * u_time * 0.3;
    float ix = i.x + u_mouse.x;
    float iy = i.y + u_mouse.y;

    i = vec2(cos(t - ix) + sin(iy + t), sin(t - iy) + cos(t + ix)) + pos;
    c += float(n) / length(vec2(pos.x / sin(t + ix) / 1.1, pos.y / cos(t + i.y))) * 22.0;
  }

  c =  c / 100.0;
  c = 1.8 - sqrt(c);


  vec4 img = texture2D(texture, vUv) * texture2D(texture, vec2(vUv.s + cos(c)*u_mouse.x * 0.24, vUv.t + cos(c)*u_mouse.y * 0.25)) * 0.30; // последний множитель это яркость
  vec4 ct = c * c * c * img;

  vec4 imgEffect = ct - img * img - vec4(img.rgb * 0.5, img.a * vPosition.z) * ratio;

  // vec4 newTx = vec4(tx.rgb, tx.a * ratio);
  gl_FragColor = imgEffect * ratio;
  // vec4 tx = texture2D( texture, vec2(vUv.s + 0.015, vUv.t + 0.015)) *
	// 	texture2D( texture, vec2( vUv.s + cos(c) * u_mouse.x * 0.5, vUv.t + cos(c) * u_mouse.y * 0.5)) * 0.25;
	// 	vec4 newTx = vec4(tx.rgb, tx.a * ratio);
	// 	vec4 ct = c * c * c * newTx;
	// 	gl_FragColor = texture2D(texture, vec2( vUv.s + c * u_mouse.x * 0.75, vUv.t +  c * u_mouse.y * 0.75));
		// gl_FragColor = (ct - newTx * newTx - vec4( tx.rgb * 0.5, tx.a * vPosition.z )) * ratio;
}
