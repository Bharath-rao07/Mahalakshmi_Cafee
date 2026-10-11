// --- Loading Screen ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            // Start initial GSAP animations after loader is gone
            gsap.from(".gsap-reveal", {
                y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out"
            });
        }, 1000);
    }, 1500); // Artificial delay to show the nice loading text
});

// --- Mobile Navigation ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '70px';
    navLinks.style.left = '0';
    navLinks.style.width = '100%';
    navLinks.style.background = 'rgba(26, 17, 10, 0.95)';
    navLinks.style.padding = '2rem 0';
    navLinks.style.textAlign = 'center';
});

// --- Three.js 3D Background (Floating Particles / Beans) ---
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Objects (Abstract Coffee Beans / Particles)
const geometry = new THREE.CapsuleGeometry(0.1, 0.2, 4, 8);
const material = new THREE.MeshStandardMaterial({ 
    color: 0xd4af37, // Gold/Coffee color
    roughness: 0.4,
    metalness: 0.6
});

const particles = new THREE.Group();
const particleCount = window.innerWidth < 768 ? 30 : 70; // Optimize for mobile

for(let i = 0; i < particleCount; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 15;
    mesh.position.y = (Math.random() - 0.5) * 15;
    mesh.position.z = (Math.random() - 0.5) * 10;
    
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    particles.add(mesh);
}
scene.add(particles);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xe67e22, 2);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

// Mouse Movement Effect
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate particles slowly
    particles.children.forEach((particle, index) => {
        particle.rotation.x += 0.002;
        particle.rotation.y += 0.003;
        // Subtle floating
        particle.position.y += Math.sin(elapsedTime * 0.5 + index) * 0.002;
    });

    // Smooth mouse follow parallax
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    particles.rotation.y += 0.05 * (targetX - particles.rotation.y);
    particles.rotation.x += 0.05 * (targetY - particles.rotation.x);

    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- GSAP Scroll Animations ---
gsap.registerPlugin(ScrollTrigger);

// Menu Cards Stagger
gsap.from(".menu-card", {
    scrollTrigger: {
        trigger: ".menu-grid",
        start: "top 80%"
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out"
});

// Features Stagger
gsap.from(".feature-card", {
    scrollTrigger: {
        trigger: ".features",
        start: "top 80%"
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2
});

// Counter Animation for Stats
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    ScrollTrigger.create({
        trigger: ".stats",
        start: "top 90%",
        onEnter: () => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const updateCount = () => {
                const inc = target / 50;
                if(count < target) {
                    count += inc;
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 40);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        }
    });
});