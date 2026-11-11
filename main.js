import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

// =====================================================
// SCENA
// =====================================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeef2f7);

const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.overflow = 'hidden';

renderer.domElement.style.position = 'fixed';
renderer.domElement.style.inset = '0';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.display = 'block';
renderer.domElement.style.touchAction = 'none';
renderer.domElement.style.cursor = 'grab';
renderer.domElement.style.zIndex = '1';

document.body.appendChild(renderer.domElement);


// =====================================================
// LUCI
// =====================================================

const hemisphereLight = new THREE.HemisphereLight(
    0xffffff,
    0x9ca9bd,
    1.7
);

scene.add(hemisphereLight);

const keyLight = new THREE.DirectionalLight(
    0xffffff,
    2.8
);

keyLight.position.set(-3, 5, 5);
keyLight.castShadow = true;

keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.left = -5;
keyLight.shadow.camera.right = 5;
keyLight.shadow.camera.top = 5;
keyLight.shadow.camera.bottom = -5;
keyLight.shadow.radius = 6;

scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(
    0xd8e8ff,
    1.2
);

fillLight.position.set(4, 2, 4);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(
    0xffffff,
    1.5
);

rimLight.position.set(1, 4, -4);
scene.add(rimLight);

const frontLight = new THREE.PointLight(
    0xffffff,
    10,
    10
);

frontLight.position.set(0, 1.5, 4);
scene.add(frontLight);


// =====================================================
// PAVIMENTO
// =====================================================

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({
        color: 0xe9edf3,
        roughness: 0.85
    })
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.05;
floor.receiveShadow = true;

scene.add(floor);


// =====================================================
// CORPO PRINCIPALE
// =====================================================

function roundedRectShape(width, height, radius) {

    const shape = new THREE.Shape();

    const x = -width / 2;
    const y = -height / 2;

    shape.moveTo(x + radius, y);

    shape.lineTo(x + width - radius, y);

    shape.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );

    shape.lineTo(x + width, y + height - radius);

    shape.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );

    shape.lineTo(x + radius, y + height);

    shape.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );

    shape.lineTo(x, y + radius);

    shape.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );

    return shape;
}

const bodyShape = roundedRectShape(
    3.35,
    1.78,
    0.18
);

const bodyGeometry = new THREE.ExtrudeGeometry(
    bodyShape,
    {
        depth: 0.42,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.045,
        bevelThickness: 0.045,
        curveSegments: 12
    }
);

bodyGeometry.center();

const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0755b8,
    metalness: 0.18,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.12
});

const body = new THREE.Mesh(
    bodyGeometry,
    bodyMaterial
);

body.position.set(-0.35, 0, 0);
body.castShadow = true;
body.receiveShadow = true;

scene.add(body);


// =====================================================
// BASE INFERIORE
// =====================================================

const base = new THREE.Mesh(
    new THREE.BoxGeometry(3.20, 0.12, 0.36),
    new THREE.MeshPhysicalMaterial({
        color: 0x06428e,
        metalness: 0.25,
        roughness: 0.28,
        clearcoat: 0.8
    })
);

base.position.set(-0.35, -0.78, 0);
base.castShadow = true;

scene.add(base);


// =====================================================
// LOGO BIANCO ADERENTE AL CORPO AZZURRO
// =====================================================

const logoFontLoader = new FontLoader();

logoFontLoader.load(
    'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',

    function (font) {

        function addLogoText(text, size, y) {

            const shapes = font.generateShapes(text, size);

            const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: 0.05,
    bevelEnabled: false,
    curveSegments: 12
});

            geometry.computeBoundingBox();

            const box = geometry.boundingBox;

            geometry.translate(
                -(box.min.x + box.max.x) / 2,
                -(box.min.y + box.max.y) / 2,
                -box.min.z
            );

            const material = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                metalness: 0.05,
                roughness: 0.25,
                clearcoat: 1,
                clearcoatRoughness: 0.12
            });

            const textMesh = new THREE.Mesh(
                geometry,
                material
            );

            // Posizione sul corpo
         textMesh.position.set(
    -0.35,
    y + 0.02,
    0.248
);

            textMesh.castShadow = true;
            textMesh.receiveShadow = true;

            scene.add(textMesh);
        }

        addLogoText('REDMINGTON', 0.25, 0.12);

        addLogoText('TENNIS EQUIPMENT', 0.105, -0.17);

        console.log('Logo bianco aderente al corpo caricato');
    },

    undefined,

    function (error) {
        console.error('Errore caricamento font:', error);
    }
);
// =====================================================
// RIFLESSO FRONTALE
// =====================================================

const shine = new THREE.Mesh(
    new THREE.PlaneGeometry(2.75, 0.025),
    new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.13,
        depthWrite: false
    })
);

shine.position.set(-0.35, 0.62, 0.318);

scene.add(shine);


// =====================================================
// TEXTURE TESSUTO TECNICO
// =====================================================

const fabricCanvas = document.createElement('canvas');

fabricCanvas.width = 512;
fabricCanvas.height = 512;

const fabricCtx = fabricCanvas.getContext('2d');

fabricCtx.fillStyle = '#14243a';
fabricCtx.fillRect(0, 0, 512, 512);

for (let y = 0; y < 512; y += 5) {

    fabricCtx.fillStyle =
        y % 10 === 0
            ? 'rgba(255,255,255,0.10)'
            : 'rgba(0,0,0,0.12)';

    fabricCtx.fillRect(0, y, 512, 2);
}

for (let x = 0; x < 512; x += 5) {

    fabricCtx.fillStyle =
        x % 10 === 0
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(0,0,0,0.12)';

    fabricCtx.fillRect(x, 0, 2, 512);
}

const fabricTexture = new THREE.CanvasTexture(fabricCanvas);

fabricTexture.colorSpace = THREE.SRGBColorSpace;
fabricTexture.wrapS = THREE.RepeatWrapping;
fabricTexture.wrapT = THREE.RepeatWrapping;
fabricTexture.repeat.set(2, 2);
fabricTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();


// =====================================================
// GRUPPO FETTUCCIA
// =====================================================

const attachment = new THREE.Group();

attachment.position.set(1.03, 0, -0.0375);

scene.add(attachment);


// =====================================================
// FETTUCCIA
// =====================================================

const strapShape = new THREE.Shape();

strapShape.moveTo(0, -0.22);

strapShape.lineTo(1.14, -0.22);

strapShape.quadraticCurveTo(
    1.38, -0.22,
    1.38, 0
);

strapShape.quadraticCurveTo(
    1.38, 0.22,
    1.14, 0.22
);

strapShape.lineTo(0, 0.22);
strapShape.lineTo(0, -0.22);

const strapHole = new THREE.Path();

strapHole.absellipse(
    1.20,
    0,
    0.19,
    0.19,
    0,
    Math.PI * 2,
    true,
    0
);

strapShape.holes.push(strapHole);

const strapGeometry = new THREE.ExtrudeGeometry(
    strapShape,
    {
        depth: 0.075,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.018,
        bevelThickness: 0.018,
        curveSegments: 32
    }
);

const strapMaterial = new THREE.MeshStandardMaterial({
    map: fabricTexture,
    color: 0xffffff,
    roughness: 0.92,
    metalness: 0
});

const strap = new THREE.Mesh(
    strapGeometry,
    strapMaterial
);

strap.castShadow = true;
strap.receiveShadow = true;

attachment.add(strap);


// =====================================================
// BORDI DELLA FETTUCCIA
// =====================================================

const borderMaterial = new THREE.MeshStandardMaterial({
    color: 0x30445f,
    roughness: 0.85
});

function addStrapBorder(x1, y1, x2, y2) {

    const dx = x2 - x1;
    const dy = y2 - y1;

    const length = Math.sqrt(dx * dx + dy * dy);

    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(length, 0.018, 0.018),
        borderMaterial
    );

    mesh.position.set(
        (x1 + x2) / 2,
        (y1 + y2) / 2,
        0.095
    );

    mesh.rotation.z = Math.atan2(dy, dx);

    attachment.add(mesh);
}

addStrapBorder(0.30, -0.215, 0.62, -0.215);
addStrapBorder(0.30, 0.215, 0.62, 0.215);


// =====================================================
// CUCITURE
// =====================================================

const stitchMaterial = new THREE.MeshStandardMaterial({
    color: 0x9aa9bb,
    roughness: 0.85
});

function addStitch(x, y, angle = 0) {

    const stitch = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.012, 0.012),
        stitchMaterial
    );

    stitch.position.set(x, y, 0.105);
    stitch.rotation.z = angle;

    attachment.add(stitch);
}

for (let i = 0; i < 20; i++) {

    const x = 0.12 + i * 0.052;

    addStitch(x, 0.17, -0.13);
}

for (let i = 0; i < 20; i++) {

    const x = 0.12 + i * 0.052;

    addStitch(x, -0.17, -0.13);
}

for (let i = 0; i < 5; i++) {

    addStitch(
        0.08,
        -0.12 + i * 0.06,
        Math.PI / 2
    );
}


// =====================================================
// RINFORZO CIRCOLARE DEL FORO
// =====================================================

const reinforcementPoints = [];

for (let i = 0; i <= 80; i++) {

    const angle = (i / 80) * Math.PI * 2;

    reinforcementPoints.push(
        new THREE.Vector3(
            1.20 + Math.cos(angle) * 0.205,
            Math.sin(angle) * 0.205,
            0.095
        )
    );
}

const reinforcementCurve = new THREE.CatmullRomCurve3(
    reinforcementPoints
);

const reinforcement = new THREE.Mesh(
    new THREE.TubeGeometry(
        reinforcementCurve,
        100,
        0.012,
        8,
        false
    ),
    borderMaterial
);

attachment.add(reinforcement);


// =====================================================
// ANELLO PORTACHIAVI
// =====================================================

const ringGroup = new THREE.Group();

ringGroup.position.set(
    1.2,
    -0.2,
    -0.05
);

ringGroup.rotation.y = THREE.MathUtils.degToRad(40);
ringGroup.rotation.z = THREE.MathUtils.degToRad(-15);

attachment.add(ringGroup);


// =====================================================
// GEOMETRIA ANELLO METALLICO
// =====================================================

const ringRadius = 0.29;

const ringPoints = [];

const turns = 1.55;
const totalAngle = Math.PI * 2 * turns;

const terminalAngle = 0;

const startAngle = terminalAngle - totalAngle;

for (let i = 0; i <= 240; i++) {

    const t = i / 240;

    const angle = startAngle + t * totalAngle;

    const radius = ringRadius - t * 0.025;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const z = t * 0.035;

    ringPoints.push(
        new THREE.Vector3(x, y, z)
    );
}

const ringCurve = new THREE.CatmullRomCurve3(
    ringPoints,
    false,
    'centripetal'
);

const ringGeometry = new THREE.TubeGeometry(
    ringCurve,
    300,
    0.032,
    12,
    false
);

const ringMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xdce4ed,
    metalness: 1,
    roughness: 0.14,
    clearcoat: 1,
    clearcoatRoughness: 0.08
});

const ring = new THREE.Mesh(
    ringGeometry,
    ringMaterial
);

ring.castShadow = true;

ringGroup.add(ring);


// =====================================================
// TERMINALE METALLICO
// =====================================================

const endCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.038, 20, 20),
    ringMaterial
);

endCap.position.copy(
    ringPoints[ringPoints.length - 1]
);

ringGroup.add(endCap);


// =====================================================
// CONTROLLI CAMERA
// =====================================================

const target = new THREE.Vector3(
    0,
    0.10,
    0
);

let cameraRadius = 8.4;
let cameraTheta = 0.018;
let cameraPhi = 1.16;

let isDragging = false;

let previousX = 0;
let previousY = 0;

const rotationSpeed = 0.008;

function updateCamera() {

    cameraPhi = THREE.MathUtils.clamp(
        cameraPhi,
        0.15,
        Math.PI - 0.15
    );

    cameraRadius = THREE.MathUtils.clamp(
        cameraRadius,
        4.5,
        14
    );

    camera.position.x =
        target.x +
        cameraRadius *
        Math.sin(cameraPhi) *
        Math.sin(cameraTheta);

    camera.position.y =
        target.y +
        cameraRadius *
        Math.cos(cameraPhi);

    camera.position.z =
        target.z +
        cameraRadius *
        Math.sin(cameraPhi) *
        Math.cos(cameraTheta);

    camera.lookAt(target);
}

updateCamera();


// =====================================================
// ROTAZIONE CON MOUSE
// =====================================================

renderer.domElement.addEventListener(
    'pointerdown',
    (event) => {

        if (event.button !== 0) return;

        isDragging = true;

        previousX = event.clientX;
        previousY = event.clientY;

        renderer.domElement.setPointerCapture(event.pointerId);

        renderer.domElement.style.cursor = 'grabbing';
    }
);

renderer.domElement.addEventListener(
    'pointermove',
    (event) => {

        if (!isDragging) return;

        const deltaX = event.clientX - previousX;
        const deltaY = event.clientY - previousY;

        previousX = event.clientX;
        previousY = event.clientY;

        cameraTheta -= deltaX * rotationSpeed;
        cameraPhi -= deltaY * rotationSpeed;

        updateCamera();
    }
);

function stopDragging() {

    isDragging = false;

    renderer.domElement.style.cursor = 'grab';
}

renderer.domElement.addEventListener(
    'pointerup',
    stopDragging
);

renderer.domElement.addEventListener(
    'pointercancel',
    stopDragging
);

renderer.domElement.addEventListener(
    'lostpointercapture',
    stopDragging
);


// =====================================================
// ZOOM
// =====================================================

renderer.domElement.addEventListener(
    'wheel',
    (event) => {

        event.preventDefault();

        cameraRadius += event.deltaY * 0.005;

        updateCamera();
    },
    { passive: false }
);


// =====================================================
// ANIMAZIONE
// =====================================================

function animate() {

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();


// =====================================================
// RESIZE
// =====================================================

window.addEventListener('resize', () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );
});