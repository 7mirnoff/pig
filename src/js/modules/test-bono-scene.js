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

  APP.mixer = []
  APP.action = []
  models.animations.forEach((anim, index) => {
    APP.mixer[index] = new THREE.AnimationMixer(model)
    APP.mixer[index].timeScale = 0.333
    APP.action[index] = APP.mixer[index].clipAction(models.animations[index])
    APP.action[index].play()
  })

  console.log(APP)
  APP.mouse = new THREE.Vector3();
  APP.head = APP.scene.children[0].children[0].children[0].children[0].children[0].children[0].children[0]
  // console.log(LeftArm);
  // APP.LeftArm.rotation.z = -100
  console.log(APP.head);

  APP.target =
  document.addEventListener('mousemove', (evt) => {

    APP.mouse.x = (( evt.clientX / window.innerWidth ) * 2 - 1) * 1000;
    APP.mouse.y = (- ( evt.clientY / window.innerHeight ) * 2 + 1) * 1000;
    APP.mouse.z = APP.camera.position.z

    APP.head.lookAt(APP.mouse)
    // APP.LeftArm.rotation.y += 0.01
    // APP.LeftArm.matrix.lookAt(APP.camera.position, new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 1, 0 ))

  })

  APP.lightAmbient = new THREE.AmbientLight(0xffffff, 1.5)
  APP.scene.add(APP.lightAmbient)

  APP.lightDirect = new THREE.DirectionalLight(0xFFFFFF, 1)
  APP.lightDirect.position.set(0, 2, 5)
  APP.lightDirect.target.position.set(0, 0, 0)

  APP.lightDirect2 = new THREE.DirectionalLight(0xFFFFFF, 0.5)
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
