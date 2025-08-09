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



typeEffect();














window.onload = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(400, 400);
  document.getElementById('three-container').appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff99 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  camera.position.z = 5;

  const colors = [
    new THREE.Color(0x00ff99),  // green (normal)
    new THREE.Color(0xffa500),  // orange (medium heat)
    new THREE.Color(0xff0000),  // red (high heat)
  ];

  // This multiplier is from page scroll position (0 to 2)
  function getScrollSpeedMultiplier() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight === 0) return 0;
    return Math.min((scrollTop / docHeight) * 2, 2);
  }

  // This multiplier is increased temporarily by wheel scroll bursts, then decays
  let wheelSpeedBoost = 0;

  window.addEventListener('wheel', (event) => {
    // Increase burst effect based on scroll wheel delta, capped to max 2
    wheelSpeedBoost += Math.min(Math.abs(event.deltaY) * 0.005, 0.5);
    if (wheelSpeedBoost > 2) wheelSpeedBoost = 2;
  });

  function animate() {
    requestAnimationFrame(animate);

    // Base speed from scroll position
    const scrollMultiplier = getScrollSpeedMultiplier();

    // Total multiplier = base scroll + temporary wheel boost
    const totalSpeedMultiplier = scrollMultiplier + wheelSpeedBoost;

    // Base rotation speeds
    const baseSpeedX = 0.01;
    const baseSpeedY = 0.02;

    cube.rotation.x += baseSpeedX * (1 + totalSpeedMultiplier);
    cube.rotation.y += baseSpeedY * (1 + totalSpeedMultiplier);

    // Color interpolation based on totalSpeedMultiplier (0 to 2)
    let color;
    if (totalSpeedMultiplier < 1) {
      color = colors[0].clone().lerp(colors[1], totalSpeedMultiplier);
    } else {
      color = colors[1].clone().lerp(colors[2], totalSpeedMultiplier - 1);
    }
    cube.material.color.copy(color);

    // Slowly decay the wheel speed boost to zero
    wheelSpeedBoost *= 0.95;

    renderer.render(scene, camera);
  }
  animate();
};

