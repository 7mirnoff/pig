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
  const model = models.scene
  model.position.set(0, -0.5, 0)
  model.scale.set(20, 20, 20)
  APP.scene.add(model)

  APP.mixer = []
  APP.action = []
  models.animations.forEach((anim, index) => {
    APP.mixer[index] = new THREE.AnimationMixer(model)
    APP.mixer[index].timeScale = 1
    APP.action[index] = APP.mixer[index].clipAction(models.animations[index])
    APP.action[index].play()
  })

  // for (const key in models) {
  //   // console.log(models);
  //   // const mesh = new THREE.Mesh(models[key].geometry, models[key].material)

  //   // meshs.push(mesh)

  //   // APP.scene.add(mesh)
  // }

  // APP.lightAmbient = new THREE.AmbientLight(0xffffff, 7.5)
  // APP.scene.add(APP.lightAmbient)

  // APP.lightDirect = new THREE.DirectionalLight(0xFFFFFF, 3)
  // APP.lightDirect.position.set(0, 2, 5)
  // APP.lightDirect.target.position.set(0, 0, 0)

  // APP.lightDirect2 = new THREE.DirectionalLight(0xFFFFFF, 1.5)
  // APP.lightDirect2.position.set(10, 7, 5)
  // APP.lightDirect2.target.position.set(0, 0, 0)

  // APP.scene.add(APP.lightDirect)
  // APP.scene.add(APP.lightDirect.target)

  // APP.scene.add(APP.lightDirect2)
  // APP.scene.add(APP.lightDirect2.target)

  let progress = 0
  const makeAnimationStep = () => {

  }

  APP.animationPool['morph'] = makeAnimationStep

  // APP.scene.add(model)

  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  light.position.set(1000, 1000, 1000)
  APP.scene.add(light)

  const size = 2000
  const divisions = 50
  const gridHelper = new THREE.GridHelper(size, divisions)
  APP.scene.add(gridHelper)
}

export {
  createScene
}
