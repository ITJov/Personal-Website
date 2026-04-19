import * as THREE from "three";
import { TrackballControls } from "../node_modules/three/examples/jsm/controls/TrackballControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bgCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

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
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
});

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
setInterval(createMeteor, 1000);

function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.001;
    camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 10 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

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

window.addEventListener('scroll', () => {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection.getBoundingClientRect().top < window.innerHeight) {
        portfolioSection.classList.add('visible');
    }
});