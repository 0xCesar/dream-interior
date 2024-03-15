import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import GUI from 'lil-gui'
import gsap from 'gsap'
import particlesVertexShader from './shaders/particles/vertex.glsl'
import particlesFragmentShader from './shaders/particles/fragment.glsl'
import img0 from './shaders/particles/0.png';
import img1 from './shaders/particles/1.png';
import img2 from './shaders/particles/2.png';
import img3 from './shaders/particles/3.png';
import img4 from './shaders/particles/4.png';
import img5 from './shaders/particles/5.png';
import img6 from './shaders/particles/6.png';
import img7 from './shaders/particles/7.png';

/**
 * Base
 */
// Debug
//const gui = new GUI({ width: 340 })
//const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: (window.innerHeight / 100) * 70,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

 
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 50)
scene.add(camera)

// Controls
//const controls = new OrbitControls(camera, canvas)
//controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/*
debugObject.clearColor = '#D6BDAF'
gui.addColor(debugObject, 'clearColor').onChange(() => { renderer.setClearColor(debugObject.clearColor) })
renderer.setClearColor(debugObject.clearColor)
*/

renderer.setClearColor('#D6BDAF')

/* Settings Carrrousel */
const nbImage = 8; // Remplacer par un tab
const rayon = 20;
const gap = 1;
const perimetre = 2 * Math.PI * rayon;
const widthPlane = (perimetre - (gap * nbImage))/nbImage;
const angles = 360/nbImage;

/* Images */ 
var textureLoader = new THREE.TextureLoader();
const texture0 = textureLoader.load(img0);
const texture1 = textureLoader.load(img1);
const texture2 = textureLoader.load(img2);
const texture3 = textureLoader.load(img3);
const texture4 = textureLoader.load(img4);
const texture5 = textureLoader.load(img5);
const texture6 = textureLoader.load(img6);
const texture7 = textureLoader.load(img7); 

const tabTexture = [texture0, texture1, texture2, texture3, texture4, texture5, texture6, texture7]
/* 
Plane
*/
const planeGeometry = new THREE.PlaneGeometry(widthPlane,(widthPlane*0.75))
var group = new THREE.Group();
var radian = 0;
for(let i=0; i <  nbImage; i = i + 1){

    const angle = (i / tabTexture.length) * Math.PI * 2;
    console.log(angle)
    const x = Math.cos(angle) * rayon;
    const y = Math.sin(angle) * rayon;
//console.log(tabTexture.length-1)
console.log(nbImage)
  /*
var planeMaterial = new THREE.ShaderMaterial({

    uniforms: {
		uAngle: { value: angle },
        uRadius: { value: rayon },
	},
	vertexShader:particlesVertexShader,
	fragmentShader: particlesFragmentShader,
    side: THREE.DoubleSide,
   //  map: tabTexture[i]
})*/

var planeMaterial = new THREE.MeshBasicMaterial({

    side: THREE.DoubleSide,
     map: tabTexture[i]
})
    var plane = new THREE.Mesh(planeGeometry, planeMaterial)


   // console.log('radian : ' + i + ' ' + radian)
    if((i === 0) || (i === 4)){
        plane.rotation.y = (90 * Math.PI)/180;
    }else if( (i === 2) || (i === 6)){
        plane.rotation.y = (0 * Math.PI)/180;
    }
    else{
        plane.rotation.y = radian;
    }
    
    
    radian +=  (angles * Math.PI)/180;

   // plane.rotation.y = radian;

   // console.log(planeMaterial.map)
    plane.position.set(x, 0, y);
    //plane.material.map = tabTexture[i]
   // console.log(tabTexture[i].image)
    
    //plane.position.z = i;
    group.add(plane);

}
scene.add(group);
//group.rotation.z = 0.1;
console.log(scene);



/**
 * Animate
 */
const tick = () =>
{
    // Update controls
  //  controls.update()  
 /* group.rotation.x += 0.01;
  group.rotation.z += 0.01;
  group.rotation.y += 0.01;*/
    // Render normal scene
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

document.querySelector('.webgl').addEventListener('mousedown', drag)
let initX, finalX;
let click = false;
function drag(event){
    click = true;
  initX = event.clientX
  document.querySelector('.webgl').addEventListener('mousemove', handleMouseMove);
  document.querySelector('.webgl').addEventListener('mouseup', handleMouseUp);
}
function handleMouseMove(event) {
    if(click){
        let deplacementX = initX - event.clientX;

        group.rotation.y += - (deplacementX * 0.0001);
    }
  

    
}
function handleMouseUp(event) {
    click = false;
   finalX = initX + event.clientX
    //camera.rotateY((initX - finalX)/100)
    //console.log((initX - finalX) )
    
    if(!click){

      //  group.rotation.y += - ((initX - finalX) * 0.00001);
        gsap.to(group.rotation, 
            {
                y : group.rotation.y  - finalX * 0.001
            })
       // let force = (initX + finalX) * 0.0001;
      //  gsap.to(group.rotation, {duration: 0.5, y: 0.001, ease: 'power2.out'})
      //  gsap.fromTo(group.rotation, {y : force}, {duration: 0.5, y: 0.001, ease: 'power2.out'})
      // group.rotation.y += 0.001;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

}

tick()