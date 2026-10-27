import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RotateCw, Sparkles, Volume2 } from 'lucide-react';
import { speakWord, playPop } from '../utils/audio';

interface ThreeLetterViewerProps {
  letter: string;
  lowercase: string;
  word: string;
  color: string;
  isLowercase: boolean;
  soundEnabled: boolean;
}

export const ThreeLetterViewer: React.FC<ThreeLetterViewerProps> = ({
  letter,
  lowercase,
  word,
  color,
  isLowercase,
  soundEnabled
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;

  const currentDisplayChar = isLowercase ? lowercase : letter;
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const bounceStartTimeRef = useRef(0);

  // Trigger bounce effect on click/tap
  const handleBounce = () => {
    bounceStartTimeRef.current = performance.now();
    playPop(soundEnabled);
    speakWord(`${currentDisplayChar}. For ${word}.`);
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

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    scene.background = null; // transparent background

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.8);

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
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa5b4fc, 1.2);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444455, 1.0);
    scene.add(hemiLight);

    // Create 3D Token Mesh Group
    const group = new THREE.Group();
    meshGroupRef.current = group;
    scene.add(group);

    // 1. Procedural High-Res Texture for Letter Badge
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Radial gradient glossy background for badge
    const radGrad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
    radGrad.addColorStop(0, '#ffffff');
    radGrad.addColorStop(0.5, color);
    radGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(256, 256, 240, 0, Math.PI * 2);
    ctx.fill();

    // Gold outer ring
    ctx.lineWidth = 24;
    ctx.strokeStyle = '#FBBF24';
    ctx.stroke();

    // Inner bright dashed ring
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FEF08A';
    ctx.setLineDash([16, 16]);
    ctx.beginPath();
    ctx.arc(256, 256, 215, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Big Friendly Letter
    ctx.font = '900 240px "Comic Sans MS", "Fredoka", "Nunito", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillText(currentDisplayChar, 262, 268);

    // Pure white letter
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(currentDisplayChar, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Front/Back material with texture
    const frontBackMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.2,
      metalness: 0.15
    });

    // Side rim material with glossy gold
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2
    });

    // 3D Coin token
    const tokenGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.32, 48);
    // Cylinder materials: [sides, top, bottom]
    const tokenMesh = new THREE.Mesh(tokenGeo, [rimMaterial, frontBackMaterial, frontBackMaterial]);
    tokenMesh.rotation.x = Math.PI / 2;
    group.add(tokenMesh);

    // Decorative floating mini stars around the letter
    const starGeo = new THREE.OctahedronGeometry(0.18, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 0.2
    });

    const starCount = 5;
    const starMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < starCount; i++) {
      const star = new THREE.Mesh(starGeo, starMat);
      const angle = (i / starCount) * Math.PI * 2;
      const radius = 2.15;
      star.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (Math.random() - 0.5) * 0.4);
      group.add(star);
      starMeshes.push(star);
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

      // Gentle auto rotation
      if (isRotatingRef.current && !isDragging) {
        group.rotation.y += 0.8 * dt;
        group.rotation.x = Math.sin(now * 0.001) * 0.15;
      }

      // Floating stars orbit
      starMeshes.forEach((s, i) => {
        s.rotation.x += 1.5 * dt;
        s.rotation.y += 2.0 * dt;
        const angle = (i / starCount) * Math.PI * 2 + now * 0.0008;
        s.position.x = Math.cos(angle) * 2.15;
        s.position.y = Math.sin(angle) * 2.15;
      });

      // Bounce animation logic
      const bounceElapsed = (now - bounceStartTimeRef.current) / 1000;
      if (bounceElapsed < 0.6) {
        const bounceScale = 1 + Math.sin(bounceElapsed * Math.PI * 3.5) * 0.22 * Math.exp(-bounceElapsed * 3.5);
        group.scale.set(bounceScale, bounceScale, bounceScale);
      } else {
        group.scale.set(1, 1, 1);
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
      const w = container.clientWidth || 340;
      const h = container.clientHeight || 340;
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

      // Dispose Three.js resources
      tokenGeo.dispose();
      starGeo.dispose();
      texture.dispose();
      frontBackMaterial.dispose();
      rimMaterial.dispose();
      starMat.dispose();
      renderer.dispose();
      if (domElement.parentElement) {
        domElement.parentElement.removeChild(domElement);
      }
    };
  }, [currentDisplayChar, color, isLowercase, word, soundEnabled]);

  return (
    <div className="relative w-full h-72 sm:h-80 flex flex-col items-center justify-center select-none" data-testid="three-letter-viewport">
      <div
        ref={containerRef}
        onClick={handleBounce}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center touch-none"
        title="Click or tap to bounce and hear pronunciation! Drag to rotate in 3D."
        aria-label={`Interactive 3D Letter ${currentDisplayChar}`}
      />

      {/* Quick Action Badges */}
      <div className="absolute top-2 right-2 flex gap-1.5">
        <button
          onClick={() => setIsRotating(prev => !prev)}
          className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1 ${
            isRotating
              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
          }`}
          title={isRotating ? 'Pause 3D Spin' : 'Resume 3D Spin'}
          aria-label={isRotating ? 'Pause 3D Spin' : 'Resume 3D Spin'}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          <span>{isRotating ? 'Spinning' : 'Paused'}</span>
        </button>

        <button
          onClick={handleBounce}
          className="px-2.5 py-1.5 rounded-full text-xs font-bold bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-300 shadow-sm flex items-center gap-1"
          title="Bounce & Hear"
          aria-label="Bounce Letter"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Bounce</span>
        </button>
      </div>

      <div className="absolute bottom-1 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-slate-600 shadow-xs flex items-center gap-1 pointer-events-none">
        <Volume2 className="w-3.5 h-3.5 text-sky-500" />
        <span>Tap letter to bounce &amp; speak • Drag to rotate</span>
      </div>
    </div>
  );
};
