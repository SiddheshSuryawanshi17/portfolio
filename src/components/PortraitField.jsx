import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// The hero photo dissolving into particles.
// At rest the real photo is shown (see Hero.jsx). As you scroll down, the
// photo fades and this layer takes over: the same portrait made of thousands
// of particles that blow apart. Nothing is drawn while the page is at the top.
// Skipped entirely on reduced-motion or software-rendered devices.

const SRC = '/images/me/portrait-cutout.webp'

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uScroll;
  uniform float uScan;
  uniform vec2 uMouse;
  uniform float uMouseOn;
  uniform vec2 uScale;     // portrait size in px
  uniform vec2 uOffset;    // portrait bottom-centre in px
  uniform float uDot;      // grid spacing in px
  uniform float uPixelRatio;
  attribute float aLum;
  attribute float aRand;
  attribute vec3 aScatter;
  varying float vLum;
  varying float vGlow;
  varying float vAlpha;

  void main() {
    vec2 target = position.xy * uScale + uOffset;
    vec2 start = aScatter.xy * uScale + uOffset;

    float t = clamp(uIntro * 1.7 - aRand * 0.7, 0.0, 1.0);
    t = 1.0 - pow(1.0 - t, 4.0);
    vec2 p = mix(start, target, t);

    // breathing wobble
    p += vec2(sin(uTime * 0.9 + aRand * 40.0), cos(uTime * 0.7 + aRand * 25.0)) * uDot * 0.18;

    // cursor repel
    vec2 d = p - uMouse;
    float dist = length(d);
    float radius = uScale.y * 0.16;
    float f = exp(-(dist * dist) / (radius * radius)) * uMouseOn;
    p += normalize(d + 0.0001) * f * radius * 0.45;

    // scroll explode
    p += (aScatter.xy - position.xy) * uScale * smoothstep(0.04, 1.0, uScroll) * (0.6 + aRand);

    // scan line (uScan is 0..1 from top to bottom of portrait)
    float py = 1.0 - position.y;
    float scan = exp(-pow((py - uScan) * 22.0, 2.0));

    vLum = aLum;
    vGlow = clamp(scan + f * 1.2, 0.0, 1.0);
    vAlpha = smoothstep(0.0, 0.1, uScroll) * (1.0 - smoothstep(0.55, 1.0, uScroll));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
    float size = uDot * (0.28 + aLum * 0.95) * (1.0 + vGlow * 0.9);
    gl_PointSize = max(size, 1.0) * uPixelRatio;
  }
`

const fragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uAccent;
  varying float vLum;
  varying float vGlow;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.32, r);
    vec3 col = mix(uBase * (0.45 + vLum * 0.75), uAccent, vGlow);
    gl_FragColor = vec4(col, a * vAlpha * (0.22 + vLum * 0.9 + vGlow));
  }
`

// Read the cut-out photo and turn it into a grid of (x, y, brightness) samples.
function samplePortrait(img, cols) {
  const rows = Math.round(cols * (img.height / img.width))
  const c = document.createElement('canvas')
  c.width = cols
  c.height = rows
  const ctx = c.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, cols, rows)
  const { data } = ctx.getImageData(0, 0, cols, rows)
  const pts = []
  let lo = 1
  let hi = 0
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4
      if (data[i + 3] < 140) continue
      const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255
      lo = Math.min(lo, lum)
      hi = Math.max(hi, lum)
      // normalised: x in -0.5..0.5 of width, y in 0..1 of height (0 = bottom)
      pts.push((x + 0.5) / cols - 0.5, 1 - (y + 0.5) / rows, lum)
    }
  }
  // stretch contrast so the face reads clearly
  for (let i = 2; i < pts.length; i += 3) pts[i] = Math.pow((pts[i] - lo) / (hi - lo || 1), 0.8)
  return { pts, cols, rows, aspect: img.width / img.height }
}

// Where the portrait sits inside the hero.
function layout(w, h, aspect) {
  const mobile = w < 760
  const height = mobile ? h * 0.6 : Math.min(h * 0.88, w * 0.6)
  const width = height * aspect
  const cx = mobile ? w * 0.56 : w * 0.66
  return { width, height, cx, bottom: 0 }
}

export default function PortraitField({ ready }) {
  const mount = useRef(null)
  const api = useRef({})

  useEffect(() => {
    const el = mount.current
    let disposed = false
    let cleanup = () => {}
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const small = window.innerWidth < 760

    const img = new Image()
    img.decoding = 'async'
    img.src = SRC
    img.onload = () => {
      if (disposed) return
      const sample = samplePortrait(img, small ? 130 : 230)
      const dpr = Math.min(window.devicePixelRatio, 2)

      // try WebGL; fall back to a static drawing on software renderers
      let renderer = null
      {
        try {
          renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' })
          const gl = renderer.getContext()
          const info = gl.getExtension('WEBGL_debug_renderer_info')
          const name = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : ''
          if (/swiftshader|llvmpipe|software/i.test(name)) {
            renderer.dispose()
            renderer = null
          }
        } catch {
          renderer = null
        }
      }

      // no capable GPU: the photo alone is shown, which is fine
      if (!renderer) return

      renderer.setPixelRatio(dpr)
      el.appendChild(renderer.domElement)
      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(0, 1, 1, 0, -10, 10)

      const n = sample.pts.length / 3
      const pos = new Float32Array(n * 3)
      const lum = new Float32Array(n)
      const rand = new Float32Array(n)
      const scatter = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) {
        pos[i * 3] = sample.pts[i * 3]
        pos[i * 3 + 1] = sample.pts[i * 3 + 1]
        lum[i] = sample.pts[i * 3 + 2]
        rand[i] = Math.random()
        const a = Math.random() * Math.PI * 2
        const r = 0.6 + Math.random() * 1.4
        scatter[i * 3] = Math.cos(a) * r * 1.4
        scatter[i * 3 + 1] = 0.5 + Math.sin(a) * r
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('aLum', new THREE.BufferAttribute(lum, 1))
      geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))
      geo.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3))

      const u = {
        uTime: { value: 0 },
        uIntro: { value: 0 },
        uScroll: { value: 0 },
        uScan: { value: -1 },
        uMouse: { value: new THREE.Vector2(-9999, -9999) },
        uMouseOn: { value: 0 },
        uScale: { value: new THREE.Vector2(1, 1) },
        uOffset: { value: new THREE.Vector2() },
        uDot: { value: 4 },
        uPixelRatio: { value: dpr },
        uBase: { value: new THREE.Color('#ecebe6') },
        uAccent: { value: new THREE.Color('#c6ff3d') },
      }
      const mat = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: u,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      })
      const points = new THREE.Points(geo, mat)
      points.frustumCulled = false
      scene.add(points)

      const resize = () => {
        const w = el.clientWidth
        const h = el.clientHeight
        renderer.setSize(w, h, false)
        camera.right = w
        camera.top = h
        camera.updateProjectionMatrix()
        const L = layout(w, h, sample.aspect)
        u.uScale.value.set(L.width, L.height)
        u.uOffset.value.set(L.cx, L.bottom)
        u.uDot.value = L.height / sample.rows
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(el)

      const mouse = new THREE.Vector2(-9999, -9999)
      let mouseOn = 0
      const onMove = (e) => {
        const r = el.getBoundingClientRect()
        mouse.set(e.clientX - r.left, r.bottom - e.clientY)
        mouseOn = 1
      }
      const onLeave = () => (mouseOn = 0)
      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerleave', onLeave)

      let visible = true
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
      io.observe(el)

      const clock = new THREE.Clock()
      let raf
      let intro = 0
      const tick = () => {
        raf = requestAnimationFrame(tick)
        if (!visible) return
        const t = clock.getElapsedTime()
        intro = 1
        const scroll = Math.min(window.scrollY / (el.clientHeight * 1.1), 1)
        // nothing to draw at the top of the page: clear once and idle
        if (scroll <= 0.001) {
          if (u.uScroll.value > 0) {
            u.uScroll.value = 0
            renderer.clear()
          }
          return
        }
        u.uTime.value = t
        u.uIntro.value = intro
        u.uScroll.value = scroll
        u.uScan.value = -1
        u.uMouse.value.lerp(mouse, 0.12)
        u.uMouseOn.value += (mouseOn - u.uMouseOn.value) * 0.06
        renderer.render(scene, camera)
      }
      tick()

      cleanup = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        io.disconnect()
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerleave', onLeave)
        geo.dispose()
        mat.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  useEffect(() => {
    if (ready) api.current.go = true
  }, [ready])

  return <div className="hero__canvas hero__portrait" ref={mount} aria-hidden="true" />
}
