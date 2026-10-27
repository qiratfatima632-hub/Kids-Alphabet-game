import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RotateCw, Sparkles, Box, Volume2 } from 'lucide-react';
import { ShapeItem } from '../types';
import { speakWord, playPop } from '../utils/audio';

interface ThreeShapeViewerProps {
  shape: ShapeItem;
  soundEnabled: boolean;
}

export const ThreeShapeViewer: React.FC<ThreeShapeViewerProps> = ({ shape, soundEnabled }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;
  const isWireframeRef = useRef(isWireframe);
  isWireframeRef.current = isWireframe;

  const bounceStartTimeRef = useRef(0);
  const meshGroupRef = useRef<THREE.Group | null>(null);

  const handleBounce = () => {
    bounceStartTimeRef.current = performance.now();
    playPop(soundEnabled);
    speakWord(`${shape.name}. ${shape.type === '3d' ? '3D Solid Shape.' : '2D Flat Shape.'}`);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.replaceChildren(renderer.domElement);

    // Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbae6fd, 1.2);
    fillLight.position.set(-4, -1, -3);
    scene.add(fillLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x475569, 1.0);
    scene.add(hemiLight);

    // Group for shape and contact shadow
    const group = new THREE.Group();
    meshGroupRef.current = group;
    scene.add(group);

    // Soft Radial Grounding Shadow beneath shape
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d')!;
    const radGrad = shadowCtx.createRadialGradient(64, 64, 5, 64, 64, 60);
    radGrad.addColorStop(0, 'rgba(15, 23, 42, 0.35)');
    radGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    shadowCtx.fillStyle = radGrad;
    shadowCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.6;
    scene.add(shadowMesh);

    // Build Shape Geometry
    let geometry: THREE.BufferGeometry;
    let initialRotationX = 0;
    let initialRotationY = 0;
    let initialScaleX = 1;
    let initialScaleY = 1;
    let initialScaleZ = 1;

    switch (shape.geometryType) {
      // 3D Solids
      case 'sphere':
        geometry = new THREE.SphereGeometry(1.4, 36, 36);
        break;
      case 'cube':
        geometry = new THREE.BoxGeometry(2.0, 2.0, 2.0);
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(1.3, 2.5, 36);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(1.2, 1.2, 2.4, 36);
        break;
      case 'pyramid':
        geometry = new THREE.ConeGeometry(1.7, 2.3, 4);
        initialRotationY = Math.PI / 4;
        break;
      case 'cuboid':
        geometry = new THREE.BoxGeometry(2.6, 1.6, 1.6);
        break;

      // 2D Extruded shapes with rounded/beveled tactile feel
      case 'circle':
        geometry = new THREE.CylinderGeometry(1.5, 1.5, 0.35, 48);
        initialRotationX = Math.PI / 2.5;
        break;
      case 'square':
        geometry = new THREE.BoxGeometry(2.2, 0.35, 2.2);
        initialRotationX = Math.PI / 3;
        break;
      case 'triangle':
        geometry = new THREE.CylinderGeometry(1.7, 1.7, 0.35, 3);
        initialRotationX = Math.PI / 2.5;
        break;
      case 'rectangle':
        geometry = new THREE.BoxGeometry(2.8, 0.35, 1.6);
        initialRotationX = Math.PI / 3;
        break;
      case 'oval':
        geometry = new THREE.CylinderGeometry(1.5, 1.5, 0.35, 40);
        initialRotationX = Math.PI / 2.5;
        initialScaleX = 1.45;
        initialScaleZ = 0.9;
        break;
      case 'diamond':
        geometry = new THREE.BoxGeometry(1.9, 0.35, 1.9);
        initialRotationX = Math.PI / 3;
        initialRotationY = Math.PI / 4;
        break;
      case 'star': {
        const starShape = new THREE.Shape();
        const points = 5;
        const outerRadius = 1.6;
        const innerRadius = 0.75;
        for (let i = 0; i < points * 2; i++) {
          const r = i % 2 === 0 ? outerRadius : innerRadius;
          const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          if (i === 0) starShape.moveTo(x, y);
          else starShape.lineTo(x, y);
        }
        starShape.closePath();
        geometry = new THREE.ExtrudeGeometry(starShape, {
          depth: 0.35,
          bevelEnabled: true,
          bevelSegments: 4,
          steps: 1,
          bevelSize: 0.08,
          bevelThickness: 0.08
        });
        geometry.center();
        initialRotationX = Math.PI / 6;
        break;
      }
      case 'heart': {
        const heartShape = new THREE.Shape();
        const x = 0, y = 0;
        heartShape.moveTo(x + 0.25, y + 0.25);
        heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
        heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
        heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 1.0);
        heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
        heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
        heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);
        geometry = new THREE.ExtrudeGeometry(heartShape, {
          depth: 0.3,
          bevelEnabled: true,
          bevelSegments: 4,
          steps: 1,
          bevelSize: 0.08,
          bevelThickness: 0.08
        });
        geometry.center();
        initialRotationX = Math.PI; // flip upright
        initialScaleX = 2.2;
        initialScaleY = 2.2;
        break;
      }
      case 'pentagon':
        geometry = new THREE.CylinderGeometry(1.6, 1.6, 0.35, 5);
        initialRotationX = Math.PI / 2.5;
        break;
      case 'hexagon':
        geometry = new THREE.CylinderGeometry(1.6, 1.6, 0.35, 6);
        initialRotationX = Math.PI / 2.5;
        break;
      default:
        geometry = new THREE.SphereGeometry(1.4, 32, 32);
    }

    // Material with cheerful rich gloss and specular sheen
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(shape.color),
      roughness: 0.25,
      metalness: 0.2,
      wireframe: isWireframe
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = initialRotationX;
    mesh.rotation.y = initialRotationY;
    mesh.scale.set(initialScaleX, initialScaleY, initialScaleZ);
    group.add(mesh);

    // Decorative floating sparkle particles
    const particleGeo = new THREE.DodecahedronGeometry(0.12, 0);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.5,
      emissive: new THREE.Color(shape.color),
      emissiveIntensity: 0.4
    });
    const particles: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Mesh(particleGeo, particleMat);
      p.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2);
      group.add(p);
      particles.push(p);
    }

    // Interactive Drag to Rotate
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      group.rotation.y += deltaX * 0.015;
      group.rotation.x += deltaY * 0.015;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Animation Loop
    let frameId = 0;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Update wireframe if toggled
      if (material.wireframe !== isWireframeRef.current) {
        material.wireframe = isWireframeRef.current;
      }

      if (isRotatingRef.current && !isDragging) {
        group.rotation.y += 0.8 * dt;
        group.rotation.x = Math.sin(now * 0.001) * 0.2;
      }

      // Sparkle float
      particles.forEach((p, idx) => {
        p.rotation.x += 1.2 * dt;
        p.position.y += Math.sin(now * 0.002 + idx) * 0.005;
      });

      // Bounce animation logic
      const bounceElapsed = (now - bounceStartTimeRef.current) / 1000;
      if (bounceElapsed < 0.6) {
        const bounceScale = 1 + Math.sin(bounceElapsed * Math.PI * 3.5) * 0.2 * Math.exp(-bounceElapsed * 3.5);
        mesh.scale.set(initialScaleX * bounceScale, initialScaleY * bounceScale, initialScaleZ * bounceScale);
      } else {
        mesh.scale.set(initialScaleX, initialScaleY, initialScaleZ);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      renderer.dispose();
      if (domElement.parentElement) {
        domElement.parentElement.removeChild(domElement);
      }
    };
  }, [shape, isWireframe, soundEnabled]);

  return (
    <div className="relative w-full h-72 sm:h-84 flex flex-col items-center justify-center select-none" data-testid="three-shape-viewport">
      <div
        ref={containerRef}
        onClick={handleBounce}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center touch-none"
        title="Click or tap to bounce and hear pronunciation! Drag to rotate in 3D."
        aria-label={`Interactive 3D ${shape.name}`}
      />

      {/* Control Badges */}
      <div className="absolute top-2 right-2 flex gap-1.5 z-10">
        <button
          onClick={() => setIsRotating(prev => !prev)}
          className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1 ${
            isRotating
              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
          }`}
          title={isRotating ? 'Pause Rotation' : 'Resume Rotation'}
          aria-label={isRotating ? 'Pause Rotation' : 'Resume Rotation'}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          <span>{isRotating ? 'Spinning' : 'Paused'}</span>
        </button>

        <button
          onClick={() => setIsWireframe(prev => !prev)}
          className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1 ${
            isWireframe
              ? 'bg-purple-600 text-white border border-purple-700'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
          }`}
          title="See Inside (Wireframe Edges)"
          aria-label="Toggle Wireframe Skeleton"
        >
          <Box className="w-3.5 h-3.5" />
          <span>{isWireframe ? 'Solid' : 'Skeleton'}</span>
        </button>

        <button
          onClick={handleBounce}
          className="px-2.5 py-1.5 rounded-full text-xs font-bold bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-300 shadow-sm flex items-center gap-1"
          title="Bounce & Hear"
          aria-label="Bounce Shape"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Bounce</span>
        </button>
      </div>

      <div className="absolute bottom-1 bg-white/85 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-slate-600 shadow-xs flex items-center gap-1 pointer-events-none">
        <Volume2 className="w-3.5 h-3.5 text-sky-500" />
        <span>Tap to bounce &amp; speak • Drag to inspect all angles</span>
      </div>
    </div>
  );
};
