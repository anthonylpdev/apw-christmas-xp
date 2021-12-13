import MainLoop from './utils/mainloop.js';
import tween from './utils/tween.js';
import hexagonTesselation from './entity/hexagonTesselation.js';
import * as THREE from './lib/three/build/three.module.js';
import { OrbitControls } from './lib/three/examples/jsm/controls/OrbitControls.js';
import WebAudioTinySynth from './lib/tinysynth/tinysynth.js';

const Tween = tween();

const radius = 11;

const trunk = hexagonTesselation({radius: 1, height: 43, tileSize: 0.9, color: '#161205'});
trunk.tesselation.position.z = -29;
trunk.tesselation.rotation.z = -Math.PI/6;


const hexagons0 = hexagonTesselation({radius: radius * 4, height: 1.5, color: '#555'});
hexagons0.tesselation.position.z = +14;
hexagons0.tesselation.rotation.z = -Math.PI/6;

const hexagons1 = hexagonTesselation({radius, height: 2});
hexagons1.tesselation.rotation.z = -Math.PI/6;

const hexagons2 = hexagonTesselation({radius: radius - 3, height: 1.8});
hexagons2.tesselation.position.z = -7;
hexagons2.tesselation.rotation.z = -Math.PI/6;

const hexagons3 = hexagonTesselation({radius: radius - 5, height: 1.5});
hexagons3.tesselation.position.z = -14;
hexagons3.tesselation.rotation.z = -Math.PI/6;

const hexagons4 = hexagonTesselation({radius: radius - 7, height: 1.2});
hexagons4.tesselation.position.z = -20;
hexagons4.tesselation.rotation.z = -Math.PI/6;

const hexagons5 = hexagonTesselation({  radius: radius - 9});
hexagons5.tesselation.position.z = -25;
hexagons5.tesselation.rotation.z = -Math.PI/6;

const hexagons6 = hexagonTesselation({radius: radius - 10});
hexagons6.tesselation.position.z = -29;
hexagons6.tesselation.rotation.z = -Math.PI/6;

let lastTween;
let synth;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 64;

const renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: false, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
resize();

// const controls = new OrbitControls(camera, renderer.domElement);

const lightPos = 1000;
const positions = [
  [lightPos, lightPos, lightPos],
  [lightPos, lightPos, -lightPos],
  [lightPos, -lightPos, lightPos],
  [lightPos, -lightPos, -lightPos],
  [-lightPos, lightPos, lightPos],
  [-lightPos, lightPos, -lightPos],
  [-lightPos, -lightPos, lightPos],
  [-lightPos, -lightPos, -lightPos],
];
const lights = []
for (const pos of positions) {
  const light = new THREE.PointLight('white', 1.);
  light.position.set(...pos);
  lights.push(light);
  scene.add(light);
  // scene.add( new THREE.PointLightHelper( light, 10 ) );
}

function fadeInHexagons(hexagons) {
  scene.add(hexagons.tesselation);
  for (const t of hexagons.tilemap.values()) {
    t.scale.z = 0.01;
    t.material.opacity = 0;
  }
  for (let chebyshevDist=0; chebyshevDist < hexagons.radius; chebyshevDist++ ) {
    let neighbors = hexagons.getNeighbors(0, 0, chebyshevDist, true);
    lastTween = Tween.create({duration: 66, after: lastTween, animate: progress => {
      for (const n of neighbors) n.material.opacity = progress;
    }});
  }
  lastTween = Tween.create({duration: 2000, after: lastTween, animate: progress => {
    for (const t of hexagons.tilemap.values()) t.scale.z = progress;
  }});
}

function fadeOutHexagons(hexagons) {
  lastTween = Tween.create({duration: 2000, after: lastTween, from: 1, to: 0.01, animate: progress => {
    for (const t of hexagons.tilemap.values()) t.scale.z = progress;
  }});

  for (let chebyshevDist=hexagons.radius; chebyshevDist >= 0; chebyshevDist-- ) {
    let neighbors = hexagons.getNeighbors(0, 0, chebyshevDist, true);
    lastTween = Tween.create({duration: 60, from: 1, to: 0, after: lastTween, animate: progress => {
      for (const n of neighbors) n.material.opacity = progress;
    }});
  }

  lastTween = Tween.create({duration: 0, after: lastTween, animate: progress => {
    scene.remove(hexagons.tesselation);
  }});
}

renderer.render(scene, camera)
document.body.appendChild(renderer.domElement);
MainLoop.setUpdate(dt => Tween.update(dt));
MainLoop.setDraw(dt => renderer.render(scene, camera));
MainLoop.start();

// setInterval(() => {
//   console.log(camera.position);
//   console.log(camera.rotation);
// }, 3000)
// scene.add(trunk.tesselation, hexagons0.tesselation, hexagons1.tesselation, hexagons2.tesselation, hexagons3.tesselation, hexagons4.tesselation, hexagons5.tesselation, hexagons6.tesselation);

let lvl = 0;
let canGoNextLvl = false;
document.querySelector('#play').addEventListener('click', playLvl0, { once: true });


function playLvl0() {
  document.querySelector('.synn-modal').classList.add('hidden');
  fadeInHexagons(hexagons0);
  for (const t of hexagons0.tilemap.values()) t.material.roughness = 1.0;
  lastTween = Tween.create({duration: 6000, from: 1, to: 0.5, after: lastTween, animate: progress => {
    for (const t of hexagons0.tilemap.values()) t.material.opacity = progress;
  }});
  lastTween = Tween.create({duration: 8000, from: 0, to: Math.PI, after: lastTween, animate: progress => {
    for (const t of hexagons0.tilemap.values()) t.rotation.x = progress;
  }});
  lastTween = Tween.create({duration: 6000, from: 0.5, after: lastTween, animate: progress => {
    for (const t of hexagons0.tilemap.values()) t.material.opacity = progress;
  }});
  lastTween = Tween.create({duration: 0, after: lastTween, animate: progress => {
    playLvl1();
  }});
}

function playLvl1() {
  synth = new WebAudioTinySynth({voices:64});
  fadeOutHexagons(hexagons0);
  fadeInHexagons(hexagons1);
  lastTween = Tween.create({duration: 1000, after: lastTween, animate: progress => {
    if (progress == 1) playHexaNote({q: 4, r: 2, noteLength: 1000});
  }});
  lastTween = Tween.create({duration: 1000, after: lastTween, animate: progress => {
    if (progress == 1) playHexaNote({q: 4, r: 4, noteLength: 1000});
  }});
  lastTween = Tween.create({duration: 1000, after: lastTween, animate: progress => {
    if (progress == 1) playHexaNote({q: 4, r: 0, noteLength: 1000});
  }});
  lastTween = Tween.create({duration: 1000, after: lastTween, animate: progress => {
    if (progress == 1) playHexaNote({q: 4, r: -5, noteLength: 1000});
  }});
  lastTween = Tween.create({duration: 1000, after: lastTween, animate: progress => {
    if (progress != 1) return;
    playHexaNote({q: 4, r: 0, noteLength: 2000});
    lvl = 1;
  }});
  lastTween = Tween.create({duration: 20000, after: lastTween, animate: progress => {
    if (progress!=1) return;
    if (lvl != 1) return;
    canGoNextLvl = true;
    hexagons1.tilemap.get('0,10').material.color = new THREE.Color('tomato');
  }});
}

function playLvl2() {
  fadeOutHexagons(hexagons1);
  fadeInHexagons(hexagons2);
  lastTween = Tween.create({duration: 0, after: lastTween, animate: progress => {
    if (progress!=1) return;
    ['-3,3', '1,-1', '4,-1', '5,-6', '-4,1'].forEach(coord => {
      hexagons2.tilemap.get(coord).userData.active = true;
      hexagons2.tilemap.get(coord).material.visible = false;
    });
    autoplay();
    lvl = 2;
  }})
  lastTween = Tween.create({duration: 60000, after: lastTween, animate: progress => {
    if (progress!=1) return;
    if (lvl != 2) return;
    canGoNextLvl = true;
    hexagons2.tilemap.get('7,0').material.color = new THREE.Color('tomato');
  }});
}

function playLvl3() {
  fadeOutHexagons(hexagons2);
  fadeInHexagons(hexagons3);

  lastTween = Tween.create({duration: 0, after: lastTween, animate: progress => {
    scene.add(hexagons4.tesselation);
    scene.add(hexagons5.tesselation);
    scene.add(hexagons6.tesselation);
    lvl = 3;
  }});
  lastTween = Tween.create({duration: 1000, from: 1, to: 0, after: lastTween, animate: progress => {
    hexagons3.tilemap.get('0,0').material.opacity = progress;
    hexagons4.tilemap.get('0,0').material.opacity = progress;
    hexagons5.tilemap.get('0,0').material.opacity = progress;
  }});
  lastTween = Tween.create({duration: 2000, from: camera.position.z, to: -25, timming: 'quad', ease: 'inOut', after: lastTween, animate: progress => {
    camera.position.z = progress
  }});
  lastTween = Tween.create({duration: 0, after: lastTween, animate: progress => {
    scene.add(hexagons0.tesselation);
    scene.add(hexagons1.tesselation);
    scene.add(hexagons2.tesselation);
    for (const t of hexagons0.tilemap.values()) t.scale.z = 1;
    for (const t of hexagons0.tilemap.values()) t.material.opacity = 1;
    for (const t of hexagons1.tilemap.values()) t.scale.z = 1;
    for (const t of hexagons1.tilemap.values()) t.material.opacity = 1;
    for (const t of hexagons2.tilemap.values()) t.scale.z = 1;
    for (const t of hexagons2.tilemap.values()) t.material.opacity = 1;
    for (const t of hexagons2.tilemap.values()) t.material.visible = true;
    hexagons0.tilemap.get('0,0').material.opacity = 0;
    hexagons1.tilemap.get('0,0').material.opacity = 0;
    hexagons1.tilemap.get('0,10').material.color = new THREE.Color('#003900');
    hexagons2.tilemap.get('0,0').material.opacity = 0;
    hexagons2.tilemap.get('7,0').material.color = new THREE.Color('#003900');
  }});
  lastTween = Tween.create({duration: 4000, from: -25, to: 64, timming: 'cubic', ease: 'out', after: lastTween, animate: progress => {
    camera.position.z = progress
  }});
  Tween.create({duration: 8000, from: 64, to: -50, timming: 'cubic', ease: 'out', after: lastTween, animate: progress => {
    camera.position.z = progress;
  }});
  Tween.create({duration: 8000, to: -100, after: lastTween, animate: progress => {
    camera.position.y = progress;
    if (progress != -100) return;
    new OrbitControls(camera, renderer.domElement);
  }});
  Tween.create({duration: 8000, to: 2, after: lastTween, animate: progress => {
    camera.rotation.x = progress;
  }});
  Tween.create({duration: 8000, to: -3.14, after: lastTween, animate: progress => {
    camera.rotation.z = progress;
  }});
  Tween.create({duration: 3400, after: lastTween, animate: progress => {
    if (progress!=1) return;
    scene.add(trunk.tesselation);
  }});


}

window.addEventListener('resize', resize);
function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
document.querySelector('canvas').addEventListener('click', event => {
  if (lvl !=1 && lvl != 2) return;
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length == 0) return;
  const tile = intersects[0].object;
  let {q, r} = tile.userData.coord;

  if (lvl == 1) {
    if (canGoNextLvl && q == 0 && r == 10) {
      lastTween = Tween.create({duration: 1000, animate: progress => {}});
      lvl = 0;
      canGoNextLvl = false;
      playLvl2();
      return;
    }
    playHexaNote({q, r});
  } else if (lvl == 2) {
    if (canGoNextLvl && q == 7 && r == 0) {
      lastTween = Tween.create({duration: 1000, animate: progress => {}});
      canGoNextLvl = false;
      lvl = 0;
      playLvl3();
      return;
    }
    tile.userData.active = !tile.userData.active;
    tile.material.visible = !tile.userData.active;
  }
});

function playHexaNote({q, r, noteLength = 750, animate = true}) {
  synth.send([0xc0, qrToSynthInstrument(q, r)]);
  synth.send([0x90, qrToMidiNote(q, r), 100]);
  setTimeout(() => synth.send([0x90, qrToMidiNote(q, r), 0]), noteLength);
  let currentHexagons;
  if (lvl == 1 || lvl == 0) currentHexagons = hexagons1;
  if (lvl == 2) currentHexagons = hexagons2;
  if (!animate) return;
  let lastTween = null;
  for (let chebyshevDist=0; chebyshevDist < radius*2; chebyshevDist++ ) {
    let neighbors = hexagons1.getNeighbors(q, r, chebyshevDist, true);
    lastTween = Tween.create({duration: 32, from: 1, to: 0.5, yoyo: true, after: lastTween, animate: progress => {
      for (const n of neighbors) n.material.opacity = progress;
    }});
  }
}

function qrToMidiNote(q, r) {
  const freq = qrToAudioFreq(q, r);
  return 12 * Math.log2(freq/440) + 69;
}

function qrToAudioFreq(q, r) {
  return Math.pow(2, r/12) * 440;
}

function qrToSynthInstrument(q, r) {
  if (lvl == 0) return 85;
  if (lvl == 1) return 13;
  if (lvl == 2) return 0;
}

function autoplay() {
  let bpm = 240;
  let duration = 8000 / (bpm / 60);
  let lastCol = 1;
  let lastCoords = [];
  Tween.create({duration, loop: true, from: -7, to: 1, animate: progress => {
    if (lvl != 2) return;
    const col = Math.floor(progress)
    if (col == lastCol || col == 1) return;
    lastCol = col;
    const coords = [];
    let r = 7;
    for (let q = col; q < col + radius; q++) {
      coords.push({q, r});
      if (--r == -8) break;
      coords.push({q, r});
      if (--r == -8) break;
    }
    for (const {q, r} of lastCoords) {
      const tile = hexagons2.tilemap.get(`${q},${r}`);
      tile.material.opacity = 1;
    }
    for (const {q, r} of coords) {
      const tile = hexagons2.tilemap.get(`${q},${r}`);
      tile.material.opacity = 0.5;
      if (tile.userData.active) playHexaNote({q, r, noteLength: duration*0.9});
    }
    lastCoords = coords;
  }})
}

// import { EXRLoader } from "./lib/three/examples/jsm/loaders/EXRLoader.js";
// https://github.com/Mamboleoo/InfiniteTubes
// let h = (elapsedT * 10 + 180) / 360;
// for (const tile of hexagons.tilemap.values()) {
//   let {q, r} = tile.userData.coord;
//   if(q != 0) continue;
//   tile.material.color = new THREE.Color(`hsl(${h},70%,60%)`);
// }

// level 1
// Tween.create({loop: true, after: lastTween, animate: progress => {
//   let h = (progress * 100 + 180) / 360;
//   hexagons.tilemap.get('0,0').material.color = new THREE.Color(`hsl(${h},70%,60%)`);
// }});


// lastTween = Tween.create({duration: 0, after: lastTween, animate: progress => {
//   if (progress != 1) return;
//   hexagons2.tesselation.visible = true;
// }});
// lastTween = Tween.create({duration: 1000, after: lastTween, timing: 'bounce', easing: 'out',animate: progress => {
//   hexagons2.tesselation.position.z = progress;
// }})

// lastTween = Tween.create({duration: 1000, from: 150, to: 0, after: lastTween, loop: true, yoyo: true, animate: progress => {
//   lights[0].position.z = progress;
// }})


// const pmremGenerator = new THREE.PMREMGenerator(renderer);
// pmremGenerator.compileEquirectangularShader();
// const loader = new EXRLoader();
// loader.setDataType(THREE.UnsignedByteType);
// loader.load("img/snow.exr", texture => {
//   const exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
//   const newEnvMap = exrCubeRenderTarget ? exrCubeRenderTarget.texture : null;
//   for (const tile of hexagons.tilemap.values()) {
//     tile.material.envMap = newEnvMap;
//     tile.material.needsUpdate = true;
//   }
//   texture.dispose();
//   MainLoop.start();
// });
// const textureLoader = new THREE.TextureLoader();
// textureLoader.load('img/env.png', function (texture) {
//   texture.mapping = THREE.SphericalReflectionMapping;
//   for (const tile of hexagons.tilemap.values()) {
//     tile.material.envMap = texture;
//     tile.material.needsUpdate = true;
//   }
//   MainLoop.start();
// });

// let neighbors = hexagons.getNeighbors(q, r);
  // Tween.create({duration: 1000, animate: progress => {
  //   for (const neighbor of neighbors) {
  //     neighbor.scale.x = 1 - progress;
  //     neighbor.scale.y = 1 - progress;
  //   }
  // }});
  // const mapQtoInstrument = new Map([
  //   [-10, 94],
  //   [-9, 103],
  //   [-8, 98],
  //   [-7, 79],
  //   [-6, 73],
  //   [-5, 68],
  //   [-4, 53],
  //   [-3, 46],
  //   [-2, 35],
  //   [-1, 27],
  //   [0, 0],
  //   [1, 9],
  //   [2, 15],
  //   [3, 82],
  //   [4, 85],
  //   [5, 88],
  //   [6, 89],
  //   [7, 95],
  //   [8, 114],
  //   [9, 115],
  //   [10, 117]
  // ]);