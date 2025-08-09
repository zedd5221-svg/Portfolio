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
    new THREE.Color(0x00ff99), // green (normal)
    new THREE.Color(0xffa500), // orange (medium heat)
    new THREE.Color(0xff0000), // red (high heat)
  ];
  
  function getScrollSpeedMultiplier() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight === 0) return 0;
    return Math.min((scrollTop / docHeight) * 2, 2);
  }
  
  let wheelSpeedBoost = 0;
  
  // Desktop scroll boost
  window.addEventListener('wheel', (event) => {
    wheelSpeedBoost += Math.min(Math.abs(event.deltaY) * 0.005, 0.5);
    if (wheelSpeedBoost > 2) wheelSpeedBoost = 2;
  });
  
  // Mobile scroll boost (detect quick swipes)
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const scrollDelta = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    
    // Boost speed proportionally to swipe distance
    if (scrollDelta > 5) {
      wheelSpeedBoost += Math.min(scrollDelta * 0.01, 0.5);
      if (wheelSpeedBoost > 2) wheelSpeedBoost = 2;
    }
  }, { passive: true });
  
  function animate() {
    requestAnimationFrame(animate);
    
    const scrollMultiplier = getScrollSpeedMultiplier();
    const totalSpeedMultiplier = scrollMultiplier + wheelSpeedBoost;
    
    cube.rotation.x += 0.01 * (1 + totalSpeedMultiplier);
    cube.rotation.y += 0.02 * (1 + totalSpeedMultiplier);
    
    let color;
    if (totalSpeedMultiplier < 1) {
      color = colors[0].clone().lerp(colors[1], totalSpeedMultiplier);
    } else {
      color = colors[1].clone().lerp(colors[2], totalSpeedMultiplier - 1);
    }
    cube.material.color.copy(color);
    
    wheelSpeedBoost *= 0.95;
    renderer.render(scene, camera);
  }
  animate();
};

