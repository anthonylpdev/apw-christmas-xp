import * as THREE from '../lib/three/build/three.module.js';

export default function ({
  radius = 2, // radius of the hexagonal tesselation. 1: 1 hexagon, 2: 1 + 6 hexagon around, 3: 1 + 6 + 12 around, 4: 1+6+12+18, ...
  tileSize = 1, // size of one of the hexagons
  height = 1, // extrude height
  color = '#003900', // base color material
  colorVariations = 3, // numbers of color variations
  colorVariationEntropy = 15, // Max diff. from the base color for each variation
} = {}) {
  // Vertices: The 6 vertices of an hexagon
  const vertices = [];
  for (let i = 0; i < 6; i++ ) {
    const angle = 1.0471975511965976 * i; // (Math.PI / 180) * (60 * i - 30);
    const vertice = new THREE.Vector2(tileSize * Math.cos(angle), tileSize * Math.sin(angle));
    vertices.push(vertice);
  }

  // Shape: draw it from the vertices
  const shape = new THREE.Shape();
  shape.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < 6; i++) {
    shape.lineTo(vertices[i].x, vertices[i].y);
  }
  shape.lineTo(vertices[0].x, vertices[0].y);

  // Geometry: extrude the shape
  const extrudeSettings = {
    steps: 1,
    depth: height,
    bevelEnabled: true,
    bevelSegments: 1,
    bevelSize: tileSize / 20,
    bevelThickness: tileSize / 20
  };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Materials: Make a simple Material for each color variation
  const matOptions = {roughness: 0.0, transparent: true};
  const colorsMaterial = [];
  if (colorVariations <= 1) {
    colorsMaterial.push(new THREE.MeshLambertMaterial({
      ...matOptions, color: new THREE.Color(color)
    }));
  } else {
    const rgb = (new THREE.Color(color)).toArray();
    let variation = -colorVariationEntropy / 255;
    const step = (2 * -variation) / colorVariations;
    for (let i = 0; i < colorVariations; i++) {
      const rgbVariation = rgb.map(color => Math.max(0, Math.min(color + variation, 1)));
      colorsMaterial.push(new THREE.MeshPhysicalMaterial({
        ...matOptions, color: new THREE.Color(...rgbVariation)
      }));
      variation += step;
    }
  }

  // Hexagon mesh: put it all togethers
  const hexagon = new THREE.Mesh(geometry,  colorsMaterial[0]);
  hexagon.scale.set(0.96, 0.96, 1); // Make a little gap between hexagon for the tesselation

  // Tesselation : explanation here https://www.redblobgames.com/grids/hexagons/#coordinates-cube
  const tilemap = new Map();
  const tesselation = new THREE.Group();
  const size = radius - 1;
  for (let q = -size; q <= size; q++) {
    for (let r = Math.max(-size, -q - size); r <= Math.min(size, -q + size); r++) {
      const s = -q - r;
      const x = tileSize * (1.5 * q);
      const y = tileSize * (Math.sqrt(3) / 2 * q  +  Math.sqrt(3) * r);
      const mesh = hexagon.clone();
      mesh.userData.coord = {q, r, s};
      mesh.position.set(x, y, 0);
      tilemap.set(`${q},${r}`, mesh);
      // set a random color variation material to this hexagon mesh
      const matIndex = Math.floor(Math.random() * colorVariations);
      mesh.userData.matIndex = matIndex;
      mesh.material = colorsMaterial[matIndex].clone();
      tesselation.add(mesh);
    }
  }

  function distanceTo(q1, r1, q2, r2) {
    return (Math.abs(q1 - q2)
      + Math.abs(q1 + r1 - q2 - r2)
      + Math.abs(r1 - r2)) / 2;
  }

  function getNeighbors(q, r, chebyshevDist = 1, outerOnly = false) {
    const test = outerOnly ? d => d == chebyshevDist : d => d <= chebyshevDist
    const neighbors = [];
    for (const tile of tilemap.values()) {
      let {q: q2, r: r2} = tile.userData.coord;
      if (test(distanceTo(q, r, q2, r2))) {
        neighbors.push(tile);
      }
    }
    return neighbors;
    // todo return sorted by (0 -1, +1 -1, +1  0, 0 +1, -1 +1, -1  0) or for dist 2:  0 -2, +1 -2, +2 -2, +2 -1, +2  0, +1 +1, 0 +2, -1 +2, -2 +2, -2 +1, -2  0, -1 -1
  }

  return {tesselation, tilemap, getNeighbors, distanceTo, radius};
}