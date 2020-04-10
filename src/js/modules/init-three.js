import APP from '../app'
import * as THREE from 'three'
import { stats } from './add-stats'
import { createScene } from './test-bono-scene'
const OrbitControls = require('three-orbit-controls')(THREE)

const canvas = document.getElementById('canvas')
let width = window.innerWidth
let height = window.innerHeight

const setSizeCanvas = () => {
  width = window.innerWidth
  height = window.innerHeight

  canvas.width = width
  canvas.height = height
}

const initThree = () => {
  setSizeCanvas()

  APP.renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  })

  APP.scene = new THREE.Scene()
  APP.animationPool = {}

  createScene()

  APP.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000) // в скобочках (угол обзора, порпорции экрана, параметры видимоcти обекта)
  APP.camera.position.set(0, 0, 10)

  APP.controls = new OrbitControls(APP.camera, APP.renderer.domElement)

  // APP.renderer.render(APP.scene, APP.camera)

  const animate = () => {
    window.requestAnimationFrame(animate)

    stats.begin()

    for (const f in APP.animationPool) {
      APP.animationPool[f]()
    }

    render()

    stats.end()
  }

  const render = () => {
    APP.renderer.render(APP.scene, APP.camera)
  }

  animate()
}

document.addEventListener('resize', () => {
  setSizeCanvas()
})

export { initThree }
