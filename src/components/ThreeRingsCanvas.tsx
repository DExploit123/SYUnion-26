/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface ThreeRingsCanvasProps {
  scrollProgress: number;
  onLoaded?: () => void;
}

export const ThreeRingsCanvas: React.FC<ThreeRingsCanvasProps> = ({
  scrollProgress,
  onLoaded,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  const [hasWebGlError, setHasWebGlError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isSoftwareGl = (() => {
      try {
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;

    try {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.38;
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFShadowMap;

      container.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0, 8.2);

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
      scene.environment = envTexture;
      pmremGenerator.dispose();

      // Lighting Rig tuned for Luminous Lilac Silk + Warm 18k Gold
      const ambientLight = new THREE.AmbientLight(0xf3d8f7, 1.3);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xfff7dc, 3.4);
      keyLight.position.set(4, 5, 5);
      keyLight.castShadow = !isSoftwareGl;
      if (!isSoftwareGl) {
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.bias = -0.0002;
      }
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xc8a2c8, 2.8);
      rimLight.position.set(-5, 3, -4);
      scene.add(rimLight);

      const fillLight = new THREE.DirectionalLight(0x8e44ad, 1.5);
      fillLight.position.set(0, -4, 3);
      scene.add(fillLight);

      // 18k Champagne Gold Band Material
      const goldMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xf6da84),
        emissive: new THREE.Color(0x452a08),
        emissiveIntensity: 0.35,
        metalness: 0.94,
        roughness: 0.13,
        clearcoat: 0.35,
        clearcoatRoughness: 0.08,
        reflectivity: 0.98,
      });

      // Lilac-Amethyst Solitaire Gemstone Material (echoing designer mockup)
      const lilacStoneMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xe6b6f5),
        emissive: new THREE.Color(0x6e2b85),
        emissiveIntensity: 0.32,
        transmission: isSoftwareGl ? 0 : 0.78,
        opacity: isSoftwareGl ? 0.9 : 1,
        transparent: true,
        roughness: 0.05,
        ior: 2.1,
        reflectivity: 1.0,
        metalness: 0.08,
        clearcoat: 0.8,
      });

      const whiteGoldMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xfffaf5),
        metalness: 0.98,
        roughness: 0.08,
        reflectivity: 1.0,
      });

      // Subtle Orbital Gold Halo Material
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xf9e59e),
        transparent: true,
        opacity: 0.52,
      });

      // Master Interlocking Rings Group
      const masterRingsGroup = new THREE.Group();
      masterRingsGroup.scale.set(0.68, 0.68, 0.68);
      masterRingsGroup.position.y = 0.25;
      scene.add(masterRingsGroup);

      // RING 1 (Samuel)
      const ring1Group = new THREE.Group();
      const ring1Geo = new THREE.TorusGeometry(1.3, 0.16, 36, 96);
      const ring1Mesh = new THREE.Mesh(ring1Geo, goldMaterial);
      ring1Mesh.castShadow = !isSoftwareGl;
      ring1Mesh.receiveShadow = !isSoftwareGl;
      ring1Group.add(ring1Mesh);

      const ring1InnerGeo = new THREE.TorusGeometry(1.29, 0.12, 24, 72);
      const ring1InnerMesh = new THREE.Mesh(ring1InnerGeo, goldMaterial);
      ring1Group.add(ring1InnerMesh);

      ring1Group.position.set(-0.55, -0.04, 0);
      ring1Group.rotation.set(
        THREE.MathUtils.degToRad(34),
        THREE.MathUtils.degToRad(-24),
        THREE.MathUtils.degToRad(14)
      );
      masterRingsGroup.add(ring1Group);

      // RING 2 (Yemisi) with Lilac Amethyst Crown
      const ring2Group = new THREE.Group();
      const ring2Geo = new THREE.TorusGeometry(1.24, 0.14, 36, 96);
      const ring2Mesh = new THREE.Mesh(ring2Geo, goldMaterial);
      ring2Mesh.castShadow = !isSoftwareGl;
      ring2Mesh.receiveShadow = !isSoftwareGl;
      ring2Group.add(ring2Mesh);

      const crownSettingGroup = new THREE.Group();
      crownSettingGroup.position.set(0, 1.32, 0);

      const diamondGeo = new THREE.OctahedronGeometry(0.26, 2);
      const diamondMesh = new THREE.Mesh(diamondGeo, lilacStoneMaterial);
      diamondMesh.scale.set(1.12, 1.15, 1.12);
      diamondMesh.position.set(0, 0.16, 0);
      crownSettingGroup.add(diamondMesh);

      const prongGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.28, 12);
      const prongOffsets = [
        [0.14, 0.1, 0.14],
        [-0.14, 0.1, 0.14],
        [0.14, 0.1, -0.14],
        [-0.14, 0.1, -0.14],
      ];
      prongOffsets.forEach(([px, py, pz]) => {
        const prong = new THREE.Mesh(prongGeo, whiteGoldMaterial);
        prong.position.set(px, py, pz);
        prong.rotation.z = px > 0 ? -0.15 : 0.15;
        prong.rotation.x = pz > 0 ? 0.15 : -0.15;
        crownSettingGroup.add(prong);
      });

      const collarGeo = new THREE.TorusGeometry(0.19, 0.03, 16, 32);
      const collar = new THREE.Mesh(collarGeo, whiteGoldMaterial);
      collar.rotation.x = Math.PI / 2;
      collar.position.set(0, 0.04, 0);
      crownSettingGroup.add(collar);

      ring2Group.add(crownSettingGroup);

      ring2Group.position.set(0.55, 0.06, 0);
      ring2Group.rotation.set(
        THREE.MathUtils.degToRad(-38),
        THREE.MathUtils.degToRad(34),
        THREE.MathUtils.degToRad(-24)
      );
      masterRingsGroup.add(ring2Group);

      // Luminous Golden Orbital Halo Ribbon (matches designer mockup swirl)
      const haloGroup = new THREE.Group();
      const haloGeo = new THREE.TorusGeometry(2.18, 0.014, 12, 128);
      const haloMesh = new THREE.Mesh(haloGeo, haloMaterial);
      haloMesh.rotation.set(
        THREE.MathUtils.degToRad(62),
        THREE.MathUtils.degToRad(-22),
        THREE.MathUtils.degToRad(18)
      );
      haloGroup.add(haloMesh);
      masterRingsGroup.add(haloGroup);

      // FLOATING BOKEH GOLD SPARKLES
      const particleCount = 110;
      const particlePositions = new Float32Array(particleCount * 3);
      const particleSpeeds = new Float32Array(particleCount);
      const particlePhases = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        particlePositions[i3] = (Math.random() - 0.5) * 14;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 10;
        particlePositions[i3 + 2] = (Math.random() - 0.5) * 7 - 1;

        particleSpeeds[i] = 0.18 + Math.random() * 0.35;
        particlePhases[i] = Math.random() * Math.PI * 2;
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 250, 224, 1)');
        gradient.addColorStop(0.35, 'rgba(243, 229, 171, 0.85)');
        gradient.addColorStop(0.7, 'rgba(200, 162, 200, 0.35)');
        gradient.addColorStop(1, 'rgba(200, 162, 200, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      const particleTexture = new THREE.CanvasTexture(canvas);

      const particleMat = new THREE.PointsMaterial({
        size: 0.18,
        map: particleTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.9,
      });

      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // DRIFTING LILAC FLOWER PETALS (3D soft-curved meshes)
      const petalCount = 18;
      const petalGeo = new THREE.PlaneGeometry(0.24, 0.15, 2, 2);
      // Curve the petal vertices slightly
      const posAttr = petalGeo.attributes.position;
      for (let v = 0; v < posAttr.count; v++) {
        const vx = posAttr.getX(v);
        const vy = posAttr.getY(v);
        posAttr.setZ(v, (vx * vx + vy * vy) * 2.2);
      }
      petalGeo.computeVertexNormals();

      const petalCanvas = document.createElement('canvas');
      petalCanvas.width = 64;
      petalCanvas.height = 64;
      const pCtx = petalCanvas.getContext('2d');
      if (pCtx) {
        const pGrad = pCtx.createRadialGradient(32, 32, 4, 32, 32, 30);
        pGrad.addColorStop(0, '#f3d1f4');
        pGrad.addColorStop(0.55, '#b86ec4');
        pGrad.addColorStop(1, 'rgba(130, 65, 145, 0)');
        pCtx.fillStyle = pGrad;
        pCtx.beginPath();
        pCtx.ellipse(32, 32, 28, 18, 0, 0, Math.PI * 2);
        pCtx.fill();
      }
      const petalTexture = new THREE.CanvasTexture(petalCanvas);
      const petalMaterial = new THREE.MeshBasicMaterial({
        map: petalTexture,
        transparent: true,
        opacity: 0.82,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      interface PetalState {
        mesh: THREE.Mesh;
        speedY: number;
        driftX: number;
        rotSpeedX: number;
        rotSpeedY: number;
        phase: number;
      }

      const petals: PetalState[] = [];
      for (let i = 0; i < petalCount; i++) {
        const mesh = new THREE.Mesh(petalGeo, petalMaterial);
        mesh.position.set(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 4 + 0.5
        );
        const s = 0.75 + Math.random() * 0.75;
        mesh.scale.set(s, s, s);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        scene.add(mesh);

        petals.push({
          mesh,
          speedY: 0.25 + Math.random() * 0.35,
          driftX: 0.15 + Math.random() * 0.25,
          rotSpeedX: (Math.random() - 0.5) * 0.8,
          rotSpeedY: (Math.random() - 0.5) * 0.8,
          phase: Math.random() * Math.PI * 2,
        });
      }

      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }

      if (onLoadedRef.current) {
        onLoadedRef.current();
      }

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        if (w < 640) {
          camera.position.z = 9.4;
        } else if (w < 1024) {
          camera.position.z = 8.6;
        } else {
          camera.position.z = 7.9;
        }
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      const timer = new THREE.Timer();
      timer.connect(document);
      let currentScroll = 0;

      const animate = (timestamp?: number) => {
        timer.update(timestamp);
        const delta = Math.min(timer.getDelta(), 0.1);
        const elapsedTime = timer.getElapsed();

        const targetScroll = scrollRef.current;
        currentScroll = THREE.MathUtils.damp(currentScroll, targetScroll, 4, delta);

        const motionFactor = prefersReducedMotion ? 0 : 1;

        if (masterRingsGroup) {
          const autoRotY = elapsedTime * 0.24 * motionFactor;
          const autoRotX = Math.sin(elapsedTime * 0.2) * 0.1 * motionFactor;

          const scrollRotY = currentScroll * Math.PI * 1.6;
          const scrollRotX = currentScroll * 0.85;
          const scrollShiftY = -currentScroll * 1.6;
          const scrollShiftZ = -currentScroll * 2.0;

          masterRingsGroup.rotation.y = autoRotY + scrollRotY;
          masterRingsGroup.rotation.x = autoRotX + scrollRotX;
          masterRingsGroup.rotation.z =
            Math.cos(elapsedTime * 0.15) * 0.06 * motionFactor + currentScroll * 0.35;

          masterRingsGroup.position.y =
            0.25 + Math.sin(elapsedTime * 0.8) * 0.06 * motionFactor + scrollShiftY;
          masterRingsGroup.position.z = scrollShiftZ;

          ring1Group.rotation.z =
            THREE.MathUtils.degToRad(14) + Math.sin(elapsedTime * 0.4) * 0.04 * motionFactor;
          ring2Group.rotation.z =
            THREE.MathUtils.degToRad(-24) - Math.cos(elapsedTime * 0.35) * 0.04 * motionFactor;

          haloGroup.rotation.z = elapsedTime * 0.35 * motionFactor;
        }

        if (particleGeo && motionFactor > 0) {
          const positions = particleGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3 + 1] += particleSpeeds[i] * delta * 0.7;
            positions[i3] += Math.sin(elapsedTime * 0.6 + particlePhases[i]) * 0.003;

            if (positions[i3 + 1] > 5.5) {
              positions[i3 + 1] = -5.5;
              positions[i3] = (Math.random() - 0.5) * 14;
            }
          }
          particleGeo.attributes.position.needsUpdate = true;
        }

        if (motionFactor > 0) {
          for (const p of petals) {
            p.mesh.position.y -= p.speedY * delta;
            p.mesh.position.x += Math.sin(elapsedTime * 0.7 + p.phase) * p.driftX * delta;
            p.mesh.rotation.x += p.rotSpeedX * delta;
            p.mesh.rotation.y += p.rotSpeedY * delta;
            if (p.mesh.position.y < -5.2) {
              p.mesh.position.y = 5.2;
              p.mesh.position.x = (Math.random() - 0.5) * 12;
            }
          }
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        timer.dispose();
        roomEnv.dispose();
        envTexture.dispose();

        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }

        ring1Geo.dispose();
        ring1InnerGeo.dispose();
        ring2Geo.dispose();
        diamondGeo.dispose();
        prongGeo.dispose();
        collarGeo.dispose();
        haloGeo.dispose();
        particleGeo.dispose();
        petalGeo.dispose();
        goldMaterial.dispose();
        lilacStoneMaterial.dispose();
        whiteGoldMaterial.dispose();
        haloMaterial.dispose();
        particleMat.dispose();
        particleTexture.dispose();
        petalMaterial.dispose();
        petalTexture.dispose();
      };
    } catch (err) {
      console.error('WebGL initialization error:', err);
      setHasWebGlError(true);
      if (onLoadedRef.current) onLoadedRef.current();
    }
  }, []);

  // Clean vector fallback when WebGL is unavailable
  if (hasWebGlError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="relative w-72 h-72 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/25 via-[#F3E5AB]/30 to-[#C8A2C8]/30 blur-2xl" />
          <svg viewBox="0 0 240 240" className="w-64 h-64 drop-shadow-xl opacity-85" aria-hidden="true">
            <defs>
              <linearGradient id="goldRingGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFF5C3" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#9A7314" />
              </linearGradient>
            </defs>
            <ellipse cx="105" cy="122" rx="58" ry="74" transform="rotate(-18 105 122)" fill="none" stroke="url(#goldRingGrad)" strokeWidth="11" />
            <ellipse cx="135" cy="122" rx="58" ry="74" transform="rotate(22 135 122)" fill="none" stroke="url(#goldRingGrad)" strokeWidth="11" />
            <circle cx="88" cy="54" r="10" fill="#E6B6F5" stroke="#FFF" strokeWidth="2" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
