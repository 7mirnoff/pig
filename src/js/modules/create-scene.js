import APP from '../app'
import * as THREE from 'three'
import {
  models
} from './loader-models'
import {
  randomOffset
} from './utils'

import { lerp } from './lerp'

const createScene = () => {
  console.log(models);
  const geometry = new THREE.Geometry()
  geometry.vertices.push(
    new THREE.Vector3(-0.5, -0.5, 0),
    new THREE.Vector3(0.5, -0.5, 0),
    new THREE.Vector3(0, 0.5, 0))
  geometry.faces.push(new THREE.Face3(0, 1, 2))

  const geometry2 = models['SMOOTHED_Z'].geometry
  console.log(geometry2);
  // const geometry = new THREE.BoxGeometry(1, 1, 1)

  const material = new THREE.MeshPhongMaterial({
    color: 0x2194ce,
    specular: 0x555555,
    shininess: 30
  })
  const model = new THREE.Mesh(geometry, material)
  model.geometry.computeVertexNormals()
  const dust = new window.Image()
  dust.src = 'img/dust.png'
  const texture = new THREE.Texture(dust)
  model.material.map = texture

  dust.onload = function () {
    model.material.needsUpdate = true
    texture.needsUpdate = true
  }
  model.material.transparent = true
  model.geometry.faceVertexUvs[0].push([
    new THREE.Vector2(),
    new THREE.Vector2(1, 0),
    new THREE.Vector2(0.5, 1)
  ])

  var matrix = new THREE.Matrix4()

  var geoms = []
  const addGeoToArray = (geo) => {
    for (const v of geo) {
      v.addScalar((Math.random() - 0.5) * 0.5)
    }

    geoms.push(geo)
  }
  addGeoToArray(new THREE.SphereGeometry(5, 16, 17).vertices)
  addGeoToArray(new THREE.BoxGeometry(6, 6, 6, 6, 6, 7).vertices)
  addGeoToArray(new THREE.TorusKnotGeometry(5, 0.5, 80, 3).vertices)
  addGeoToArray(new THREE.TorusGeometry(5, 1, 16, 16).vertices)
  addGeoToArray(new THREE.ConeGeometry(5, 10, 16, 16).vertices)

  // const sphereGeo = new THREE.SphereGeometry(5, 16, 16)
  const pointsPos = [new THREE.Vector3()]
  const tempGeo = model.geometry.clone()
  for (let i = 0; i < 256; i++) {
    pointsPos.push(new THREE.Vector3())
    model.geometry.merge(tempGeo, matrix)
  }

  model.position.z -= 10
  model.material.depthWrite = false

  model.geometry.computeVertexNormals()

  // анимация
  let progress = 0
  let geoNum = 0
  let geo1 = geoms[0]
  let geo2 = geoms[1]
  let dist
  let angle
  const distVector1 = new THREE.Vector3()
  const distVector2 = new THREE.Vector3()

  const makeAnimationStep = () => {
    progress += 0.01

    if (progress <= 1) {
      for (let i = 0; i < pointsPos.length; i++) {
        if (geo1[i] && geo2[i]) {
          pointsPos[i].y = lerp(geo1[i].y, geo2[i].y, progress)
          distVector1.copy(geo1[i]).setY(0)
          distVector2.copy(geo2[i]).setY(0)
          dist = lerp(distVector1.length(), distVector2.length(), progress)
          angle = lerp(Math.atan2(distVector1.z, distVector1.x), Math.atan2(distVector2.z, distVector2.x) + Math.PI * 2, progress)
          pointsPos[i].z = dist * Math.sin(angle)
          pointsPos[i].x = dist * Math.cos(angle)
        } else {
          pointsPos[i].set(100, 100, 100)
        }
        matrix.setPosition(pointsPos[i])
        model.geometry.vertices[i * 3].setFromMatrixPosition(matrix).add(tempGeo.vertices[0])
        model.geometry.vertices[i * 3 + 1].setFromMatrixPosition(matrix).add(tempGeo.vertices[1])
        model.geometry.vertices[i * 3 + 2].setFromMatrixPosition(matrix).add(tempGeo.vertices[2])
      }

      model.geometry.verticesNeedUpdate = true
    }

    if (progress >= 2) {
      progress = 0
      geoNum++
    }

    if (geoNum === geoms.length) {
      geoNum = 0
    }

    geo1 = geoms[geoNum]
    geo2 = geoms[geoNum + 1]

    if (geoNum === geoms.length - 1) {
      geo2 = geoms[0]
    }
  }

  APP.animationPool['morph'] = makeAnimationStep

  APP.scene.add(model)

  // const light = new THREE.DirectionalLight(0xffffff)
  // light.position.set(0, 100, 100).normalize()
  // APP.scene.add(light)
}

export {
  createScene
}
