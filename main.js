import { TEAMS } from "./data/teams.js";
import { RATINGS } from "./data/ratings.js";
import { Player } from "./systems/Player.js";
import { Ball } from "./systems/Ball.js";

// BASIC THREE.JS SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b6623);

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHTING
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
scene.add(sun);

// FIELD
const field = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 50),
  new THREE.MeshStandardMaterial({ color: 0x1e7f3b })
);
field.rotation.x = -Math.PI / 2;
scene.add(field);

// PLAYER MODEL CREATOR
function createPlayerMesh(color) {
  const mesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 1.5, 4, 8),
    new THREE.MeshStandardMaterial({ color })
  );
  mesh.position.y = 1.5;
  return mesh;
}

// SELECT TEAM (FOR NOW HARD-CODED)
const team = TEAMS[0];

// QB
const qbMesh = createPlayerMesh(team.color);
qbMesh.position.set(-30, 0, 0);
scene.add(qbMesh);

const qb = new Player(qbMesh, RATINGS.QB);

// BALL
const ball = new Ball(scene, qbMesh);

// CAMERA
camera.position.set(-38, 15, 15);
camera.lookAt(qbMesh.position);

// INPUT
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// LOOP
function animate() {
  requestAnimationFrame(animate);

  let dx = 0, dz = 0;
  if (keys["w"]) dz -= 1;
  if (keys["s"]) dz += 1;
  if (keys["a"]) dx -= 1;
  if (keys["d"]) dx += 1;

  qb.move(dx, dz);
  ball.update();

  camera.position.x = qbMesh.position.x - 8;
  camera.position.z = qbMesh.position.z + 15;
  camera.lookAt(qbMesh.position);

  renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener("resize", ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

