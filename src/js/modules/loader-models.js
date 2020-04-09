import * as THREE from 'three'
import GLTFLoader from 'three-gltf-loader'

const loader = new GLTFLoader()
const location = window.location.href
const models = {}

const sourses = [
  '/libs/shape_L.glb'
]

const loadGLTFs = (cb) => {
  sourses.forEach(sourse => {
    let src = location + sourse

    if (location === 'http://localhost:3000/') {
      src = `..${sourse}`
    }

    loader.load(
      // resource URL
      src,
      // called when the resource is loaded
      function (gltf) {
        models[gltf.scene.children[0].name] = gltf.scene.children[0]
        cb()
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded')
      },
      // called when loading has errors
      function (error) {
        console.log(`Ошибка загрузки ${src}: ${error}`)
      }
    )
  })

  console.log(models);
}

export { loadGLTFs, models }
