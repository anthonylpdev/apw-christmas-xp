import * as THREE from './../lib/three/build/three.module.js';
import vertexShader from '../shaders/vertexShader.mjs'
import fragmentShader from '../shaders/fragmentShader.mjs'

/* GEOMETRY */
// const vertices = new Float32Array([
//   -1,0,0,
//   1,0,0,
//   0,1,0,
// ]);
// const position = new THREE.BufferAttribute(vertices, 3, false);
// const geometry = new THREE.BufferGeometry();
// geometry.setAttribute('position', position);

let geometry;
// geometry = new THREE.SphereBufferGeometry(2);
geometry = new THREE.BoxBufferGeometry(2,2,2,2,2,2);

export let displacement = new Float32Array(geometry.attributes.position.count);
displacement = displacement.map(v => Math.random());
geometry.setAttribute('displacement', new THREE.BufferAttribute(displacement, 1));

const uniforms = {
  time: { type: 'f', value: 0. },
  resolution: { type: 'v2', value: new THREE.Vector2() },
};

export const material = new THREE.ShaderMaterial({uniforms, vertexShader, fragmentShader});
export const mesh = new THREE.Mesh(geometry, material);


