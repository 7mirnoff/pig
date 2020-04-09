import './modules/polyfill'
import APP from './app'
import * as THREE from 'three'
import { loadGLTFs, models } from './modules/loader-models'
import { initThree } from './modules/init-three'

// import vertexShader from './modules/shader.vert'
// import fragmentShader from './modules/shader.frag'

loadGLTFs(initThree)



// const clock = new THREE.Clock()
// let delta = clock.getDelta()

// const animate = () => {
//   window.requestAnimationFrame(animate)

//   stats.begin()

//   // delta = clock.getDelta()

//   render()

//   stats.end()
// }

// const render = () => {
//   renderer.render(scene, camera)
// }

// animate()
