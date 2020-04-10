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
  for (const key in models) {
    const mesh = new THREE.Mesh(models[key].geometry, models[key].material)

    meshs.push(mesh)

    APP.scene.add(mesh)
  }

  let progress = 0
  const makeAnimationStep = () => {

  }

  APP.animationPool['morph'] = makeAnimationStep

  // APP.scene.add(model)

  const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  light.position.set(1000, 1000, 1000)
  APP.scene.add(light)
}

export {
  createScene
}
