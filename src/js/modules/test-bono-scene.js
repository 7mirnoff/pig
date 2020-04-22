import APP from '../app'
import * as THREE from 'three'
import {
  models
} from './loader-models'
import {
  randomOffset
} from './utils'

const meshs = []

const createScene = () => {
  console.log(models);
  const model = models.scene
  model.position.set(0, -0.5, 0)
  model.scale.set(20, 20, 20)
  APP.scene.add(model)

  APP.duration = models.animations[0].duration

  APP.mixer = new THREE.AnimationMixer(model)
  APP.mixer.timeScale = 1
  APP.action = APP.mixer.clipAction(models.animations[0])
  APP.action.play()
  // for (const key in models) {
  //   // console.log(models);
  //   // const mesh = new THREE.Mesh(models[key].geometry, models[key].material)

  //   // meshs.push(mesh)

  //   // APP.scene.add(mesh)
  // }

  APP.lightAmbient = new THREE.AmbientLight(0xffffff, 7.5)
  APP.scene.add(APP.lightAmbient)

  APP.lightDirect = new THREE.DirectionalLight(0xFFFFFF, 3)
  APP.lightDirect.position.set(0, 2, 5)
  APP.lightDirect.target.position.set(0, 0, 0)

  APP.lightDirect2 = new THREE.DirectionalLight(0xFFFFFF, 1.5)
  APP.lightDirect2.position.set(10, 7, 5)
  APP.lightDirect2.target.position.set(0, 0, 0)

  APP.scene.add(APP.lightDirect)
  APP.scene.add(APP.lightDirect.target)

  APP.scene.add(APP.lightDirect2)
  APP.scene.add(APP.lightDirect2.target)

  let progress = 0
  const makeAnimationStep = () => {

  }

  APP.animationPool['morph'] = makeAnimationStep

  // APP.scene.add(model)

  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  light.position.set(1000, 1000, 1000)
  APP.scene.add(light)
}

export {
  createScene
}
