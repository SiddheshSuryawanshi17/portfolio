import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// A flowing terrain of particles viewed in perspective. Noise drives the
// waves; the cursor pushes a glowing ripple through the field.
const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPixelRatio;
  uniform float uScroll;
  attribute float aRand;
  varying float vGlow;
  varying float vDepth;

  // Ashima 3D simplex noise
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main(){
    vec3 p = position;
    float t = uTime * 0.12;
    float n = snoise(vec3(p.x * 0.18, p.z * 0.22 - t, t * 0.6));
    float n2 = snoise(vec3(p.x * 0.6 + 4.0, p.z * 0.6, t * 1.4)) * 0.25;
    p.y += (n + n2) * 1.15;

    // cursor ripple (mouse projected onto the field's xz plane)
    float d = distance(p.xz, uMouse);
    float ripple = exp(-d * d * 0.35);
    p.y += ripple * (1.4 + sin(d * 3.0 - uTime * 3.0) * 0.35);

    p.y -= uScroll * 2.0;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    vDepth = clamp(-mv.z / 26.0, 0.0, 1.0);
    vGlow = smoothstep(0.35, 1.6, p.y + uScroll * 2.0) + ripple * 0.9;
    float size = (1.4 + aRand * 1.4 + vGlow * 2.2) * uPixelRatio;
    gl_PointSize = size * (12.0 / -mv.z);
  }
`

const fragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uAccent;
  varying float vGlow;
  varying float vDepth;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.0, r);
    vec3 col = mix(uBase, uAccent, clamp(vGlow, 0.0, 1.0));
    float alpha = a * (0.25 + vGlow * 0.75) * (1.0 - vDepth * 0.85);
    gl_FragColor = vec4(col, alpha);
  }
`

export default function NeuralField() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return // no WebGL: the CSS background still looks fine
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isSmall = window.innerWidth < 760
    const dpr = Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(dpr)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
    camera.position.set(0, 3.2, 9)
    camera.lookAt(0, 0, -2)

    // grid of points
    const cols = isSmall ? 120 : 220
    const rows = isSmall ? 80 : 130
    const width = 28
    const depth = 22
    const count = cols * rows
    const positions = new Float32Array(count * 3)
    const rand = new Float32Array(count)
    let i = 0
    for (let z = 0; z < rows; z++) {
      for (let x = 0; x < cols; x++) {
        positions[i * 3] = (x / (cols - 1) - 0.5) * width + (Math.random() - 0.5) * 0.04
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = (z / (rows - 1) - 0.5) * depth - 4
        rand[i] = Math.random()
        i++
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 2) },
      uPixelRatio: { value: dpr },
      uScroll: { value: 0 },
      uBase: { value: new THREE.Color('#7a7a74') },
      uAccent: { value: new THREE.Color('#c6ff3d') },
    }
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // map the cursor onto the ground plane
    const raycaster = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const ndc = new THREE.Vector2()
    const hit = new THREE.Vector3()
    const target = new THREE.Vector2(0, 2)

    const onMove = (e) => {
      const rect = mount.getBoundingClientRect()
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(ndc, camera)
      if (raycaster.ray.intersectPlane(plane, hit)) target.set(hit.x, hit.z)
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.fov = w / h < 1 ? 70 : 55
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    // pause when off-screen
    let visible = true
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(mount)

    const clock = new THREE.Clock()
    let raf
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      const t = clock.getElapsedTime()
      uniforms.uTime.value = reduce ? 4 : t
      uniforms.uMouse.value.lerp(target, 0.06)
      uniforms.uScroll.value = Math.min(window.scrollY / window.innerHeight, 1.5)
      camera.position.x += (ndc.x * 0.6 - camera.position.x) * 0.03
      camera.lookAt(0, 0, -2)
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      ro.disconnect()
      io.disconnect()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="hero__canvas" ref={mountRef} aria-hidden="true" />
}
