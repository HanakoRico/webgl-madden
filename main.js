// SCENE SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b6623);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHTING
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// FIELD
const fieldGeo = new THREE.PlaneGeometry(100, 50);
const fieldMat = new THREE.MeshStandardMaterial({ color: 0x1e7f3b });
const field = new THREE.Mesh(fieldGeo, fieldMat);
field.rotation.x = -Math.PI / 2;
scene.add(field);

// PLAYER MODEL (QB)
function createPlayer(color) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 1.2, 4, 8),
    new THREE.MeshStandardMaterial({ color })
  );
  body.position.y = 1.2;
  group.add(body);

  return group;
}

const qb = createPlayer(0x003594);
qb.position.set(-30, 0, 0);
scene.add(qb);

// CAMERA POSITION
camera.position.set(-35, 15, 15);
camera.lookAt(qb.position);

// CONTROLS
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// GAME LOOP
function animate() {
  requestAnimationFrame(animate);

  // QB movement
  if (keys["w"]) qb.position.z -= 0.3;
  if (keys["s"]) qb.position.z += 0.3;
  if (keys["a"]) qb.position.x -= 0.3;
  if (keys["d"]) qb.position.x += 0.3;

  // Camera follow
  camera.position.x = qb.position.x - 5;
  camera.position.z = qb.position.z + 12;
  camera.lookAt(qb.position);

  renderer.render(scene, camera);
}

animate();

// RESIZE HANDLER
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
