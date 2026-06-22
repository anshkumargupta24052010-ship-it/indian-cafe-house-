const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Camera setup with optimized field of view
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 6);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --- High-End 3D Metal & Ceramic Cup ---
const cafeGroup = new THREE.Group();

// Beautiful Golden-Bronze Metallic material for high shine reflection
const premiumMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xc59b6c, 
    roughness: 0.15, 
    metalness: 0.85,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
});

// 1. Premium Cup Base Shape
const cupGeo = new THREE.CylinderGeometry(1.1, 0.85, 1.7, 45);
const cup = new THREE.Mesh(cupGeo, premiumMaterial);
cafeGroup.add(cup);

// 2. Sleek Loop Handle
const handleGeo = new THREE.TorusGeometry(0.45, 0.12, 16, 45, Math.PI * 1.5);
const handle = new THREE.Mesh(handleGeo, premiumMaterial);
handle.position.set(1.05, 0, 0);
handle.rotation.z = -Math.PI / 1.35;
cafeGroup.add(handle);

// 3. Hot Liquid Face
const liquidGeo = new THREE.CylinderGeometry(1.06, 1.06, 0.08, 32);
const liquidMat = new THREE.MeshStandardMaterial({ color: 0x3d220f, roughness: 0.3 });
const liquid = new THREE.Mesh(liquidGeo, liquidMat);
liquid.position.y = 0.78;
cafeGroup.add(liquid);

// Shift the cup position to the right side of screen dynamically on desktops
if(window.innerWidth > 968) {
    cafeGroup.position.x = 2.0; 
}
scene.add(cafeGroup);

// --- Floating Particle Field ---
const particleCount = 45;
const particleGeo = new THREE.DodecahedronGeometry(0.12, 1);
const particleMat = new THREE.MeshStandardMaterial({ color: 0x503321, roughness: 0.4, metalness: 0.5 });
const particlesGroup = new THREE.Group();

const beans = [];
for(let i=0; i<particleCount; i++) {
    const bean = new THREE.Mesh(particleGeo, particleMat);
    bean.position.set(
        (Math.random() - 0.3) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5
    );
    bean.userData = { speedX: Math.random() * 0.008, speedY: Math.random() * 0.008 };
    particlesGroup.add(bean);
    beans.push(bean);
}
scene.add(particlesGroup);

// --- Ultra Studio Lighting (Removes Darkness) ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.55); // Increased Global brightness
scene.add(ambientLight);

// Key Directional Light to generate reflection shadows
const dirLight = new THREE.DirectionalLight(0xffeebb, 4.5);
dirLight.position.set(5, 6, 4);
scene.add(dirLight);

// Opposite fill light for edge accents
const fillLight = new THREE.PointLight(0xd4af37, 2, 12);
fillLight.position.set(-6, -2, 2);
scene.add(fillLight);

// Interactive Physics Control
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX - window.innerWidth / 2) * 0.0012;
    targetY = (e.clientY - window.innerHeight / 2) * 0.0012;
});

// Frame Renderer Process Loop
function animate() {
    requestAnimationFrame(animate);

    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    // Cup float animation controls
    cafeGroup.position.y = Math.sin(Date.now() * 0.0012) * 0.12;
    cafeGroup.rotation.y = Date.now() * 0.0004 + currentX * 1.3;
    cafeGroup.rotation.x = currentY * 0.6;

    // Particle rain simulation loop
    beans.forEach(b => {
        b.rotation.x += b.userData.speedX;
        b.rotation.y += b.userData.speedY;
        b.position.y -= 0.003;
        if(b.position.y < -4) b.position.y = 4;
    });

    renderer.render(scene, camera);
}
animate();

// Handle Desktop/Mobile responsive scaling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if(window.innerWidth <= 968) {
        cafeGroup.position.x = 0;
    } else {
        cafeGroup.position.x = 2.0;
    }
});
// [KEEP ALL THE EXTREME THREE.JS 3D CUP GENERATION CODE UNTOUCHED FROM PREVIOUS CODE HERE]

// --- New Feature: WhatsApp Feedback/Rating Submission Trigger ---
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const phoneNumber = "918109944185"; // Temporary Number

    // Fetch dynamic radio star selection value
    const selectedStar = document.querySelector('input[name="star"]:checked').value;
    const reviewNote = document.getElementById('reviewMessage').value;

    const feedbackPayload = `*ICH AMBIKAPUR - NEW VIBE REVIEW* ⭐%0A%0A` +
                            `💖 *Rating Score:* ${selectedStar}%0A` +
                            `📝 *Feedback Note:* ${reviewNote}%0A%0A` +
                            `Thank you for elevating our coffee space experience! ☕`;

    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${feedbackPayload}`, '_blank');
});