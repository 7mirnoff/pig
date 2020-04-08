import './modules/polyfill'
import * as THREE from 'three'
import GLTFLoader from 'three-gltf-loader'
import Stats from 'stats.js'

import {
  TimelineMax
} from "gsap/all"

import vertexShader from './modules/shader.vert'
import fragmentShader from './modules/shader.frag'

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

const OrbitControls = require(`three-orbit-controls`)(THREE)

let width = window.innerWidth
let height = window.innerHeight
const canvas = document.getElementById('canvas')

canvas.width = width
canvas.height = height

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
})
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100) // в скобочках (угол обзора, порпорции экрана, параметры видимоcти обекта)
camera.position.set(0, 0, 2.3)

const light = new THREE.PointLight(0xffffcc, 20, 100)
light.position.set(4, 30, -20)
scene.add(light)

const light2 = new THREE.AmbientLight(0x404040, 1, 0.5)
light2.position.set(30, -10, 30)
scene.add(light2)

const controls = new OrbitControls(camera, renderer.domElement)

let model = null
let meshs = []
let mixer = null
let action = null
let duration = null
let zModel = null
let lModel = null
let isJump = false

const location = window.location.href
let src = location + '/libs/onepoly_sim3.glb'
let src2 = location + '/libs/shape_L.glb'
let src3 = location + '/libs/shape_Z.glb'

if (location === 'http://localhost:3000/') {
  src = '../libs/onepoly_sim3.glb'
  src2 = '../libs/shape_L.glb'
  src3 = '../libs/shape_Z.glb'
}

console.log(src);

const loader = new GLTFLoader()

loader.load(
  // resource URL
  src2,
  // called when the resource is loaded
  function (gltf) {
    zModel = gltf.scene.children[0]
    console.log(gltf);
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded')
  },
  // called when loading has errors
  function (error) {
    console.log('An error happened:', error)
  }
)

loader.load(
  // resource URL
  src3,
  // called when the resource is loaded
  function (gltf) {
    lModel = gltf.scene.children[0]
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded')
  },
  // called when loading has errors
  function (error) {
    console.log('An error happened:', error)
  }
)

loader.load(
  // resource URL
  src,
  // called when the resource is loaded
  function (gltf) {
    model = gltf.scene
    meshs = model.children[0].children[0].children[0].children
    meshs.forEach((mesh, i) => {
      // lModel.scale.set(mesh.scale)
      if (i % 2 === 0) {
        mesh.geometry = zModel.geometry
        mesh.material = zModel.material
      } else {
        mesh.geometry = lModel.geometry
        mesh.material = lModel.material
      }

      mesh.scale.set(0.00003, 0.00003, 0.00003)
    })

    model.position.set(0, -0.5, 0)
    model.scale.set(20, 20, 20)
    scene.add(model)

    duration = gltf.animations[0].duration

    mixer = new THREE.AnimationMixer(model)
    mixer.timeScale = 1
    action = mixer.clipAction(gltf.animations[0])
    action.play()
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  // called when loading has errors
  function (error) {
    console.log('An error happened')
  }
)

renderer.render(scene, camera)

const clock = new THREE.Clock()
let delta = clock.getDelta()
let isPlay = true

const animate = () => {
  window.requestAnimationFrame(animate)

  stats.begin()

  delta = clock.getDelta()
  if (mixer && isPlay) {
    mixer.update(delta)
  }

  if (model) {
    // model.rotation.y += 0.003
  }

  if (isJump) {
    meshs.forEach((mesh, index) => {
      if (index % 2 === 0) {
        mesh.position.x += 0.0003
        // mesh.position.y += 0.0003
        // mesh.position.z += 0.0003
      } else {
        mesh.position.x -= 0.0003
        // mesh.position.y -= 0.0003
        // mesh.position.z -= 0.0003
      }

    })
  }

  render()

  stats.end()
}

const render = () => {
  renderer.render(scene, camera)
}

animate()

const buttonPlay = document.querySelector('.play')
const buttonPause = document.querySelector('.pause')
const buttonReset = document.querySelector('.reset')

buttonPlay.addEventListener('click', () => {
  isPlay = true
})

buttonPause.addEventListener('click', () => {
  isPlay = false
  isJump = false
})

buttonReset.addEventListener('click', () => {
  mixer.setTime(0)
})

const inputRange = document.querySelector('.range')

inputRange.addEventListener('input', () => {
  isPlay = false
  isJump = false
  mixer.setTime(duration * inputRange.value / 100)
})

const inputJump = document.querySelector('.jump')



inputJump.addEventListener('click', () => {
  isPlay = false
  isJump = true
})
