import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const vertexShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uAmplitude1;
  uniform float uAmplitude2;
  uniform float uFrequency1;
  uniform float uFrequency2;
  uniform vec2 uPointer;

  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vWave;
  varying vec3 vViewPosition;

  vec3 waves() {
    vec3 p = position;
    float wave1 = sin(p.x * uFrequency1 + uTime * uSpeed) * uAmplitude1;
    float wave2 = cos(p.y * uFrequency2 - uTime * uSpeed * 0.8) * uAmplitude2;
    p.z += wave1 + wave2;
    p.z += sin(p.x * 2.0 + uTime) * 0.1;

    float dist = distance(p.xy, uPointer * 3.0);
    float influence = smoothstep(2.0, 0.0, dist);
    p.z += influence * 0.3 * sin(dist * 3.0 - uTime * 2.0);

    return p;
  }

  void main() {
    vUv = uv;
    vec3 newPosition = waves();
    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = -mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    vWave = newPosition.z;
  }
`;

const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;

  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vWave;
  varying vec3 vViewPosition;

  vec3 softlight(vec3 base, vec3 blend) {
    vec3 result;
    if (blend.r < 0.5)
      result.r = base.r - (1.0 - 2.0 * blend.r) * base.r * (1.0 - base.r);
    else
      result.r = base.r + (2.0 * blend.r - 1.0) * (sqrt(base.r) - base.r);

    if (blend.g < 0.5)
      result.g = base.g - (1.0 - 2.0 * blend.g) * base.g * (1.0 - base.g);
    else
      result.g = base.g + (2.0 * blend.g - 1.0) * (sqrt(base.g) - base.g);

    if (blend.b < 0.5)
      result.b = base.b - (1.0 - 2.0 * blend.b) * base.b * (1.0 - base.b);
    else
      result.b = base.b + (2.0 * blend.b - 1.0) * (sqrt(base.b) - base.b);

    return result;
  }

  void main() {
    float mixValue = (vWave * 0.4) + 0.5;
    vec3 color = mix(uColor1, uColor2, clamp(mixValue, 0.0, 1.0));

    vec3 viewDirection = normalize(vViewPosition);
    float fresnel = dot(viewDirection, vNormal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 1.8);

    color = mix(color, uColor3, fresnel * 0.4);

    float shadow = smoothstep(0.0, 0.7, vWave);
    color = mix(uColor1 * 0.8, color, shadow);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

const gradientVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const gradientFragmentShader = `
  uniform vec3 uTopColor;
  uniform vec3 uBottomColor;
  uniform vec3 uHighlightColor;
  uniform float uHighlightStrength;
  uniform float uHighlightSize;

  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    vec3 color = mix(uBottomColor, uTopColor, vUv.y);
    float highlight = smoothstep(uHighlightSize, 0.0, dist);
    color += uHighlightColor * highlight * uHighlightStrength;
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

export default function ClothBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      50
    );
    camera.position.set(0, 0, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // Cloth mesh
    const isMobile = window.innerWidth < 768;
    const segments = isMobile ? 45 : 65;
    const clothGeometry = new THREE.PlaneGeometry(6.5, 6.5, segments, segments);

    const clothUniforms = {
      uTime: { value: 0.0 },
      uSpeed: { value: 0.3 },
      uAmplitude1: { value: 0.4 },
      uAmplitude2: { value: 0.2 },
      uFrequency1: { value: 1.5 },
      uFrequency2: { value: 2.0 },
      uColor1: { value: new THREE.Vector3(0.02, 0.02, 0.02) },
      uColor2: { value: new THREE.Vector3(0.06, 0.06, 0.06) },
      uColor3: { value: new THREE.Vector3(0.18, 0.18, 0.18) },
      uPointer: { value: new THREE.Vector2(0, 0) },
    };

    const clothMaterial = new THREE.MeshPhysicalMaterial({
      color: '#0A0A0A',
      metalness: 0.7,
      roughness: 0.15,
      side: THREE.DoubleSide,
      flatShading: false,
      emissive: '#000000',
      envMapIntensity: 1.0,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
    });

    clothMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = clothUniforms.uTime;
      shader.uniforms.uSpeed = clothUniforms.uSpeed;
      shader.uniforms.uAmplitude1 = clothUniforms.uAmplitude1;
      shader.uniforms.uAmplitude2 = clothUniforms.uAmplitude2;
      shader.uniforms.uFrequency1 = clothUniforms.uFrequency1;
      shader.uniforms.uFrequency2 = clothUniforms.uFrequency2;
      shader.uniforms.uColor1 = clothUniforms.uColor1;
      shader.uniforms.uColor2 = clothUniforms.uColor2;
      shader.uniforms.uColor3 = clothUniforms.uColor3;
      shader.uniforms.uPointer = clothUniforms.uPointer;

      shader.vertexShader = vertexShader;
      shader.fragmentShader = fragmentShader;
    };

    const clothMesh = new THREE.Mesh(clothGeometry, clothMaterial);
    clothMesh.customDepthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
    });
    clothMesh.customDepthMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = clothUniforms.uTime;
      shader.uniforms.uSpeed = clothUniforms.uSpeed;
      shader.uniforms.uAmplitude1 = clothUniforms.uAmplitude1;
      shader.uniforms.uAmplitude2 = clothUniforms.uAmplitude2;
      shader.uniforms.uFrequency1 = clothUniforms.uFrequency1;
      shader.uniforms.uFrequency2 = clothUniforms.uFrequency2;
      shader.uniforms.uPointer = clothUniforms.uPointer;
      shader.vertexShader = vertexShader;
    };
    scene.add(clothMesh);

    // Background gradient mesh
    const gradientGeometry = new THREE.PlaneGeometry(18, 18, 1, 1);
    const gradientMaterial = new THREE.ShaderMaterial({
      vertexShader: gradientVertexShader,
      fragmentShader: gradientFragmentShader,
      uniforms: {
        uTopColor: { value: new THREE.Vector3(0.04, 0.02, 0.02) },
        uBottomColor: { value: new THREE.Vector3(0.02, 0.01, 0.01) },
        uHighlightColor: { value: new THREE.Vector3(0.1, 0.05, 0.05) },
        uHighlightStrength: { value: 0.6 },
        uHighlightSize: { value: 0.4 },
      },
      depthWrite: false,
    });
    const gradientMesh = new THREE.Mesh(gradientGeometry, gradientMaterial);
    gradientMesh.position.z = -2;
    scene.add(gradientMesh);

    // Lighting
    const dirLight = new THREE.DirectionalLight('#FF2A2A', 1.0);
    dirLight.position.set(-2, 4, 3);
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight('#1a1a1a', 0.8);
    scene.add(ambientLight);

    // Mouse
    const pointer = new THREE.Vector2();
    const onMouseMove = (ev: MouseEvent) => {
      pointer.x = (ev.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation
    let time = 0;
    let animationId: number;

    const animate = () => {
      if (!reducedMotion) {
        time += 0.005 * 0.3;
        clothUniforms.uTime.value = time;
        clothUniforms.uPointer.value.lerp(pointer, 0.05);
      }
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      clothGeometry.dispose();
      clothMaterial.dispose();
      gradientGeometry.dispose();
      gradientMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'auto',
      }}
    />
  );
}
