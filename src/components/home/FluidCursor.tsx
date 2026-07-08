'use client'

import { useEffect, useRef } from 'react'

/**
 * FluidCursor — GPU fluid simulation (Stam stable fluids) that renders a
 * transparent white "dye" swirling over whatever is behind the canvas.
 * Self-contained WebGL2, no dependencies. Adapted from the well-known
 * PavelDoGreat fluid-sim architecture (MIT), modified for transparent
 * alpha output so a video/background shows through.
 *
 * Drop inside a position:relative parent; it fills the parent.
 */
export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    })
    if (!gl) {
      console.warn('WebGL2 not available — FluidCursor disabled')
      return
    }

    const ext = {
      colorBufferFloat: gl.getExtension('EXT_color_buffer_float'),
      floatLinear: gl.getExtension('OES_texture_float_linear'),
    }

    // ── CONFIG ──────────────────────────────────────────
    const SIM_RES = 128 // velocity field resolution
    const DYE_RES = 512 // dye (visual) resolution
    const DENSITY_DISSIPATION = 6.0 // dye fades fast → background pieces back together quickly
    const VELOCITY_DISSIPATION = 4.5 // motion settles fast
    const PRESSURE = 0.8
    const PRESSURE_ITER = 20
    const CURL = 6 // lower = less lingering swirl
    const SPLAT_RADIUS = 0.2 // size of cursor injection
    const SPLAT_FORCE = 6000
    // ────────────────────────────────────────────────────

    // ── SHADERS ──
    const baseVertex = `#version 300 es
      precision highp float;
      in vec2 aPosition;
      out vec2 vUv;
      out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }`

    const clearShader = `#version 300 es
      precision highp float; precision highp sampler2D;
      in vec2 vUv; out vec4 outColor;
      uniform sampler2D uTexture; uniform float value;
      void main () { outColor = value * texture(uTexture, vUv); }`

    const splatShader = `#version 300 es
      precision highp float; precision highp sampler2D;
      in vec2 vUv; out vec4 outColor;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture(uTarget, vUv).xyz;
        outColor = vec4(base + splat, 1.0);
      }`

    const advectionShader = `#version 300 es
      precision highp float; precision highp sampler2D;
      in vec2 vUv; out vec4 outColor;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      void main () {
        vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
        vec4 result = texture(uSource, coord);
        float decay = 1.0 + dissipation * dt;
        outColor = result / decay;
      }`

    const divergenceShader = `#version 300 es
      precision highp float; precision highp sampler2D;
      in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
      out vec4 outColor;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture(uVelocity, vL).x;
        float R = texture(uVelocity, vR).x;
        float T = texture(uVelocity, vT).y;
        float B = texture(uVelocity, vB).y;
        vec2 C = texture(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        outColor = vec4(div, 0.0, 0.0, 1.0);
      }`

    const curlShader = `#version 300 es
      precision highp float; precision highp sampler2D;
      in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
      out vec4 outColor;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture(uVelocity, vL).y;
        float R = texture(uVelocity, vR).y;
        float T = texture(uVelocity, vT).x;
        float B = texture(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        outColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }`

    const vorticityShader = `#version 300 es
      precision highp float; precision highp sampler2D;
      in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
      out vec4 outColor;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture(uCurl, vL).x;
        float R = texture(uCurl, vR).x;
        float T = texture(uCurl, vT).x;
        float B = texture(uCurl, vB).x;
        float C = texture(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture(uVelocity, vUv).xy;
        vel += force * dt;
        vel = clamp(vel, -1000.0, 1000.0);
        outColor = vec4(vel, 0.0, 1.0);
      }`

    const pressureShader = `#version 300 es
      precision highp float; precision highp sampler2D;
      in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
      out vec4 outColor;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture(uPressure, vL).x;
        float R = texture(uPressure, vR).x;
        float T = texture(uPressure, vT).x;
        float B = texture(uPressure, vB).x;
        float divergence = texture(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        outColor = vec4(pressure, 0.0, 0.0, 1.0);
      }`

    const gradientSubtractShader = `#version 300 es
      precision highp float; precision highp sampler2D;
      in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
      out vec4 outColor;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture(uPressure, vL).x;
        float R = texture(uPressure, vR).x;
        float T = texture(uPressure, vT).x;
        float B = texture(uPressure, vB).x;
        vec2 velocity = texture(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        outColor = vec4(velocity, 0.0, 1.0);
      }`

    // Display: refract the background video by the fluid velocity.
    // Transparent where there's no fluid (real video shows through);
    // where fluid is present, samples the video at a displaced UV → warping.
    const displayShader = `#version 300 es
      precision highp float; precision highp sampler2D;
      in vec2 vUv; out vec4 outColor;
      uniform sampler2D uVideo;      // background (baseMap)
      uniform sampler2D uVelocity;   // flow field
      uniform sampler2D uDye;        // where the fluid is (mask)
      uniform vec2 uCanvasSize;
      uniform vec2 uVideoSize;
      uniform float uStrength;

      // object-fit: cover UV mapping
      vec2 coverUV(vec2 uv, vec2 canvas, vec2 media) {
        float ca = canvas.x / canvas.y;
        float ma = media.x / media.y;
        vec2 scale = vec2(1.0);
        if (ca > ma) { scale.y = ma / ca; }
        else { scale.x = ca / ma; }
        return (uv - 0.5) * scale + 0.5;
      }

      void main () {
        vec2 vel = texture(uVelocity, vUv).xy;
        vec2 disp = vel * uStrength;

        vec2 uv = coverUV(vUv, uCanvasSize, uVideoSize);
        vec2 sampleUv = vec2(uv.x, 1.0 - uv.y) + disp;
        sampleUv = clamp(sampleUv, 0.001, 0.999);
        vec3 color = texture(uVideo, sampleUv).rgb;

        // Brighten toward light blue
        color = color * 1.6 + vec3(0.1, 0.22, 0.4);
        color = clamp(color, 0.0, 1.0);

        // Alpha follows BRIGHTNESS: dark pixels become transparent (background
        // shows through), only bright water highlights are visible → no dark.
        float lum = dot(color, vec3(0.299, 0.587, 0.114));
        float dye = texture(uDye, vUv).r;
        float alpha = clamp(dye, 0.0, 1.0) * lum * 1.1;
        outColor = vec4(color, alpha);
      }`

    // ── GL helpers ──
    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!
      gl!.shaderSource(s, src)
      gl!.compileShader(s)
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(s))
      }
      return s
    }
    function program(vsrc: string, fsrc: string) {
      const p = gl!.createProgram()!
      gl!.attachShader(p, compile(gl!.VERTEX_SHADER, vsrc))
      gl!.attachShader(p, compile(gl!.FRAGMENT_SHADER, fsrc))
      gl!.linkProgram(p)
      if (!gl!.getProgramParameter(p, gl!.LINK_STATUS)) {
        console.error(gl!.getProgramInfoLog(p))
      }
      const uniforms: Record<string, WebGLUniformLocation | null> = {}
      const n = gl!.getProgramParameter(p, gl!.ACTIVE_UNIFORMS)
      for (let i = 0; i < n; i++) {
        const name = gl!.getActiveUniform(p, i)!.name
        uniforms[name] = gl!.getUniformLocation(p, name)
      }
      return { program: p, uniforms }
    }

    const progs = {
      clear: program(baseVertex, clearShader),
      splat: program(baseVertex, splatShader),
      advection: program(baseVertex, advectionShader),
      divergence: program(baseVertex, divergenceShader),
      curl: program(baseVertex, curlShader),
      vorticity: program(baseVertex, vorticityShader),
      pressure: program(baseVertex, pressureShader),
      gradient: program(baseVertex, gradientSubtractShader),
      display: program(baseVertex, displayShader),
    }

    // Fullscreen quad
    const quad = gl.createVertexArray()
    gl.bindVertexArray(quad)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    function blit(target: FBO | null) {
      if (target) {
        gl!.viewport(0, 0, target.width, target.height)
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo)
      } else {
        gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight)
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null)
      }
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
    }

    // ── Framebuffers ──
    type FBO = {
      texture: WebGLTexture
      fbo: WebGLFramebuffer
      width: number
      height: number
      texelSizeX: number
      texelSizeY: number
      attach: (id: number) => number
    }
    type DoubleFBO = {
      width: number
      height: number
      texelSizeX: number
      texelSizeY: number
      read: FBO
      write: FBO
      swap: () => void
    }

    function createFBO(w: number, h: number, internal: number, format: number, type: number, filter: number): FBO {
      gl!.activeTexture(gl!.TEXTURE0)
      const texture = gl!.createTexture()!
      gl!.bindTexture(gl!.TEXTURE_2D, texture)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filter)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filter)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internal, w, h, 0, format, type, null)

      const fbo = gl!.createFramebuffer()!
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo)
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0)
      gl!.viewport(0, 0, w, h)
      gl!.clear(gl!.COLOR_BUFFER_BIT)

      return {
        texture, fbo, width: w, height: h,
        texelSizeX: 1 / w, texelSizeY: 1 / h,
        attach(id: number) {
          gl!.activeTexture(gl!.TEXTURE0 + id)
          gl!.bindTexture(gl!.TEXTURE_2D, texture)
          return id
        },
      }
    }

    function createDoubleFBO(w: number, h: number, internal: number, format: number, type: number, filter: number): DoubleFBO {
      let fbo1 = createFBO(w, h, internal, format, type, filter)
      let fbo2 = createFBO(w, h, internal, format, type, filter)
      return {
        width: w, height: h, texelSizeX: 1 / w, texelSizeY: 1 / h,
        get read() { return fbo1 },
        set read(v) { fbo1 = v },
        get write() { return fbo2 },
        set write(v) { fbo2 = v },
        swap() { const t = fbo1; fbo1 = fbo2; fbo2 = t },
      }
    }

    const RG = gl.RG16F
    const RGBA = gl.RGBA16F
    const R = gl.R16F
    const filtering = ext.floatLinear ? gl.LINEAR : gl.NEAREST

    let dye: DoubleFBO
    let velocity: DoubleFBO
    let divergenceFBO: FBO
    let curlFBO: FBO
    let pressure: DoubleFBO

    function initFramebuffers() {
      dye = createDoubleFBO(DYE_RES, DYE_RES, RGBA, gl!.RGBA, gl!.HALF_FLOAT, filtering)
      velocity = createDoubleFBO(SIM_RES, SIM_RES, RG, gl!.RG, gl!.HALF_FLOAT, filtering)
      divergenceFBO = createFBO(SIM_RES, SIM_RES, R, gl!.RED, gl!.HALF_FLOAT, gl!.NEAREST)
      curlFBO = createFBO(SIM_RES, SIM_RES, R, gl!.RED, gl!.HALF_FLOAT, gl!.NEAREST)
      pressure = createDoubleFBO(SIM_RES, SIM_RES, R, gl!.RED, gl!.HALF_FLOAT, gl!.NEAREST)
    }
    initFramebuffers()

    // ── Video texture (baseMap) — the background we refract ──
    const parentEl = canvas.parentElement || document.body
    const videoEl = parentEl.querySelector('video') as HTMLVideoElement | null

    const videoTexture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, videoTexture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    // 1x1 placeholder until the video has frames
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]))

    let videoW = 1
    let videoH = 1
    let videoLogged = false

    function updateVideoTexture() {
      if (!videoEl) {
        if (!videoLogged) { console.warn('[FluidCursor] no <video> found in parent'); videoLogged = true }
        return
      }
      if (videoEl.readyState >= 2 && videoEl.videoWidth > 0) {
        videoW = videoEl.videoWidth
        videoH = videoEl.videoHeight
        try {
          gl!.bindTexture(gl!.TEXTURE_2D, videoTexture)
          gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, videoEl)
          if (!videoLogged) {
            console.log('[FluidCursor] video texture OK', videoW, 'x', videoH)
            videoLogged = true
          }
        } catch (err) {
          if (!videoLogged) { console.warn('[FluidCursor] video upload failed', err); videoLogged = true }
        }
      }
    }

    // ── Canvas sizing ──
    const parent = canvas.parentElement || document.body
    function resize() {
      const rect = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)

    // ── Pointer ──
    const pointers = { x: 0, y: 0, dx: 0, dy: 0, down: false, moved: false }
    function updatePointer(e: PointerEvent) {
      const rect = parent.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = 1 - (e.clientY - rect.top) / rect.height
      pointers.dx = (x - pointers.x) * SPLAT_FORCE
      pointers.dy = (y - pointers.y) * SPLAT_FORCE
      pointers.x = x
      pointers.y = y
      pointers.moved = Math.abs(pointers.dx) > 0 || Math.abs(pointers.dy) > 0
    }
    parent.addEventListener('pointermove', updatePointer)

    function splat(x: number, y: number, dx: number, dy: number) {
      // velocity splat
      gl!.useProgram(progs.splat.program)
      gl!.uniform1i(progs.splat.uniforms['uTarget'], velocity.read.attach(0))
      gl!.uniform1f(progs.splat.uniforms['aspectRatio'], canvas.width / canvas.height)
      gl!.uniform2f(progs.splat.uniforms['point'], x, y)
      gl!.uniform3f(progs.splat.uniforms['color'], dx, dy, 0)
      gl!.uniform1f(progs.splat.uniforms['radius'], SPLAT_RADIUS / 100)
      blit(velocity.write); velocity.swap()

      // dye splat (white)
      gl!.uniform1i(progs.splat.uniforms['uTarget'], dye.read.attach(0))
      gl!.uniform3f(progs.splat.uniforms['color'], 0.9, 0.9, 0.9)
      blit(dye.write); dye.swap()
    }

    // ── Sim step ──
    let lastTime = performance.now()
    let raf = 0

    function step(dt: number) {
      gl!.disable(gl!.BLEND)
      gl!.bindVertexArray(quad)

      // Curl
      gl!.useProgram(progs.curl.program)
      gl!.uniform2f(progs.curl.uniforms['texelSize'], velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(progs.curl.uniforms['uVelocity'], velocity.read.attach(0))
      blit(curlFBO)

      // Vorticity
      gl!.useProgram(progs.vorticity.program)
      gl!.uniform2f(progs.vorticity.uniforms['texelSize'], velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(progs.vorticity.uniforms['uVelocity'], velocity.read.attach(0))
      gl!.uniform1i(progs.vorticity.uniforms['uCurl'], curlFBO.attach(1))
      gl!.uniform1f(progs.vorticity.uniforms['curl'], CURL)
      gl!.uniform1f(progs.vorticity.uniforms['dt'], dt)
      blit(velocity.write); velocity.swap()

      // Divergence
      gl!.useProgram(progs.divergence.program)
      gl!.uniform2f(progs.divergence.uniforms['texelSize'], velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(progs.divergence.uniforms['uVelocity'], velocity.read.attach(0))
      blit(divergenceFBO)

      // Clear pressure
      gl!.useProgram(progs.clear.program)
      gl!.uniform1i(progs.clear.uniforms['uTexture'], pressure.read.attach(0))
      gl!.uniform1f(progs.clear.uniforms['value'], PRESSURE)
      blit(pressure.write); pressure.swap()

      // Pressure solve
      gl!.useProgram(progs.pressure.program)
      gl!.uniform2f(progs.pressure.uniforms['texelSize'], velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(progs.pressure.uniforms['uDivergence'], divergenceFBO.attach(0))
      for (let i = 0; i < PRESSURE_ITER; i++) {
        gl!.uniform1i(progs.pressure.uniforms['uPressure'], pressure.read.attach(1))
        blit(pressure.write); pressure.swap()
      }

      // Gradient subtract
      gl!.useProgram(progs.gradient.program)
      gl!.uniform2f(progs.gradient.uniforms['texelSize'], velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(progs.gradient.uniforms['uPressure'], pressure.read.attach(0))
      gl!.uniform1i(progs.gradient.uniforms['uVelocity'], velocity.read.attach(1))
      blit(velocity.write); velocity.swap()

      // Advect velocity
      gl!.useProgram(progs.advection.program)
      gl!.uniform2f(progs.advection.uniforms['texelSize'], velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(progs.advection.uniforms['uVelocity'], velocity.read.attach(0))
      gl!.uniform1i(progs.advection.uniforms['uSource'], velocity.read.attach(0))
      gl!.uniform1f(progs.advection.uniforms['dt'], dt)
      gl!.uniform1f(progs.advection.uniforms['dissipation'], VELOCITY_DISSIPATION)
      blit(velocity.write); velocity.swap()

      // Advect dye
      gl!.uniform1i(progs.advection.uniforms['uVelocity'], velocity.read.attach(0))
      gl!.uniform1i(progs.advection.uniforms['uSource'], dye.read.attach(1))
      gl!.uniform1f(progs.advection.uniforms['dissipation'], DENSITY_DISSIPATION)
      blit(dye.write); dye.swap()
    }

    const REFRACT_STRENGTH = 0.02 // how much the fluid warps the video

    function render() {
      gl!.enable(gl!.BLEND)
      gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA)
      gl!.useProgram(progs.display.program)

      // bind video texture to unit 0
      gl!.activeTexture(gl!.TEXTURE0)
      gl!.bindTexture(gl!.TEXTURE_2D, videoTexture)
      gl!.uniform1i(progs.display.uniforms['uVideo'], 0)

      gl!.uniform1i(progs.display.uniforms['uVelocity'], velocity.read.attach(1))
      gl!.uniform1i(progs.display.uniforms['uDye'], dye.read.attach(2))
      gl!.uniform2f(progs.display.uniforms['uCanvasSize'], canvas.width, canvas.height)
      gl!.uniform2f(progs.display.uniforms['uVideoSize'], videoW, videoH)
      gl!.uniform1f(progs.display.uniforms['uStrength'], REFRACT_STRENGTH)
      blit(null)
    }

    function frame() {
      const now = performance.now()
      let dt = (now - lastTime) / 1000
      dt = Math.min(dt, 0.0166)
      lastTime = now

      if (pointers.moved) {
        splat(pointers.x, pointers.y, pointers.dx, pointers.dy)
        pointers.moved = false
      }

      updateVideoTexture()
      step(dt)
      render()
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      parent.removeEventListener('pointermove', updatePointer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 6, // above video (z-5), below content (z-10)
      }}
    />
  )
}