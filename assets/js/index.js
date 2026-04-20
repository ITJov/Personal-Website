import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bgCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Inisialisasi Controls
const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 4.0;
controls.dynamicDampingFactor = 0.1;

const geometry = new THREE.BufferGeometry();
const vertices = [];
for (let i = 0; i < 500; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    vertices.push(x, y, z);
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

const material = new THREE.PointsMaterial({ color: 0xffffff, size: 2, transparent: true, opacity: 0.8 });
const points = new THREE.Points(geometry, material);
scene.add(points);

camera.position.z = 500;

// Meteor effect
const meteors = [];
const meteorMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
function createMeteor() {
    const meteorGeometry = new THREE.SphereGeometry(2, 8, 15);
    const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);
    meteor.position.set(Math.random() * 800 - 400, Math.random() * 500 + 300, -500);
    meteors.push(meteor);
    scene.add(meteor);
}
setInterval(createMeteor, 2000); // Diperlambat sedikit agar tidak berat

function animate() {
    requestAnimationFrame(animate);
    
    // Update controls setiap frame
    controls.update(); 
    
    points.rotation.y += 0.001;

    meteors.forEach((meteor, index) => {
        meteor.position.x += 5;
        meteor.position.y -= 5;
        meteor.position.z += 10;
        if (meteor.position.z > 500) {
            scene.remove(meteor);
            meteors.splice(index, 1);
        }
    });
    
    renderer.render(scene, camera);
}
animate();

// Resize handler agar background tidak pecah saat window diubah
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
