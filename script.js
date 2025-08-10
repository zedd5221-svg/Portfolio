const text = "Hi, I'm Sarcon"; // Your text
const limit = 20;            // Only type first 6 letters
let index = 0;
let deleting = false;
const speed = 150;          // Typing speed
const delay = 1000;         // Pause delay (ms)

function typeEffect() {
  const typingElement = document.querySelector('.typing');

  if (!deleting && index < limit) {
    typingElement.textContent = text.substring(0, index + 1);
    index++;
    setTimeout(typeEffect, speed);

  } else if (!deleting && index === limit) {
    // Pause before deleting
    setTimeout(() => {
      deleting = true;
      typeEffect();
    }, delay);

  } else if (deleting && index > 1) {
    typingElement.textContent = text.substring(0, index - 1);
    index--;
    setTimeout(typeEffect, speed);

  } else if (deleting && index === 1) {
    // Pause before typing again
    setTimeout(() => {
      deleting = false;
      typeEffect();
    }, delay);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  typeEffect();
});







const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(50);

//renderer.render(scene, camera);

//Shape
const geometry = new THREE.TorusGeometry(10, 3, 16, 100)

//material
const material = new THREE.MeshBasicMaterial({color: 0xFF6347, wireframe: true});

//Mesh
const torus = new THREE.Mesh( geometry, material);

scene.add(torus);


//stars
function addstar() {
  
  const geometry = new THREE.SphereGeometry(0.25, 24, 24)
  
  const material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
  
  const star = new THREE.Mesh(geometry, material);
  
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  
  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addstar)


//for background
const spaceTexture = new THREE.TextureLoader().load('spacebg.jpg');

scene.background = spaceTexture;

//Texture the objects.
// Moon texture
const moonTexture = new THREE.TextureLoader().load('moon.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture })
);

moon.position.set(0, 0, 0);
scene.add(moon);

// Add light for moon and torus
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);

scene.add(pointLight, ambientLight);

//camera
function moveCamera() {
  const t = document.body.getBoundingClientRect().top();
  
  
  camera.position.x = t * -0.21;
  camera.position.y = t * -0.21;
  camera.position.z = t * -0.01;
  
  
}

document.body.onscroll = moveCamera

window.addEventListener('scroll', moveCamera);

let lastY = 0;

window.addEventListener('touchstart', e => {
  lastY = e.touches[0].clientY;
});

window.addEventListener('touchmove', e => {
  let deltaY = e.touches[0].clientY - lastY;
  lastY = e.touches[0].clientY;
  
  camera.position.x += deltaY * -0.01;
  camera.position.z += deltaY * -0.20;
  camera.position.y += deltaY * -0.01;
  
});

function animate() {
  requestAnimationFrame(animate)
  
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;
  
  moon.rotation.x += 0.01;
  moon.rotation.y += 0.01;
  moon.rotation.z += 0.01;
  
  renderer.render( scene, camera)
}

animate();