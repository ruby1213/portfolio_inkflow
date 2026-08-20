import { useEffect, useRef } from 'react';

/**
 * Real-time WebGL fluid simulation (stable-fluids style: advection, divergence,
 * pressure Jacobi solve, vorticity confinement) used to paint ink onto the
 * washi-paper background. Ported from the original vanilla-JS implementation.
 *
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef
 * @param {React.RefObject<boolean>} darkRef - mutable ref, true when dark mode is active
 * @returns {React.RefObject<object>} controller ref exposing setColor/setCycle/setAuto/washAway
 */
export function useFluidSim(canvasRef, darkRef) {
  const controllerRef = useRef({
    setColor: () => {},
    setCycle: () => {},
    setAuto: () => {},
    washAway: () => {},
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let destroyed = false;
    let rafId = null;

    function resizeCanvas() {
      const w = Math.floor(window.innerWidth), h = Math.floor(window.innerHeight);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; return true; }
      return false;
    }
    resizeCanvas();

    const params = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: window.innerWidth < 700 ? 512 : 900,
      DENSITY_DISSIPATION: 0.985,
      VELOCITY_DISSIPATION: 0.985,
      PRESSURE_ITERATIONS: 18,
      CURL: 22,
      SPLAT_RADIUS: 0.0022,
      SPLAT_FORCE: 6200,
    };

    const glOpts = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false, premultipliedAlpha: false };
    let gl = canvas.getContext('webgl2', glOpts);
    const isWebGL2 = !!gl;
    if (!gl) gl = canvas.getContext('webgl', glOpts) || canvas.getContext('experimental-webgl', glOpts);
    if (!gl) { console.warn('WebGL not supported'); return undefined; }

    let ext;
    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      ext = {
        formatRGBA: { internalFormat: gl.RGBA16F, format: gl.RGBA },
        formatRG: { internalFormat: gl.RG16F, format: gl.RG },
        formatR: { internalFormat: gl.R16F, format: gl.RED },
        texType: gl.HALF_FLOAT,
        supportLinear: !!gl.getExtension('OES_texture_float_linear'),
      };
    } else {
      const hf = gl.getExtension('OES_texture_half_float');
      const hfl = gl.getExtension('OES_texture_half_float_linear');
      ext = {
        formatRGBA: { internalFormat: gl.RGBA, format: gl.RGBA },
        formatRG: { internalFormat: gl.RGBA, format: gl.RGBA },
        formatR: { internalFormat: gl.RGBA, format: gl.RGBA },
        texType: hf ? hf.HALF_FLOAT_OES : gl.UNSIGNED_BYTE,
        supportLinear: !!hfl,
      };
    }
    const filtering = ext.supportLinear ? gl.LINEAR : gl.NEAREST;

    function compileShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    }
    function createProgram(vsSrc, fsSrc) {
      const p = gl.createProgram();
      gl.attachShader(p, compileShader(gl.VERTEX_SHADER, vsSrc));
      gl.attachShader(p, compileShader(gl.FRAGMENT_SHADER, fsSrc));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(p));
      const uniforms = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i); uniforms[info.name] = gl.getUniformLocation(p, info.name); }
      return { program: p, uniforms };
    }

    const baseVertex = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform vec2 texelSize;
      void main(){
        vUv = aPosition*0.5+0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }`;

    const copyShader = `
      precision mediump float; varying vec2 vUv; uniform sampler2D uTexture;
      void main(){ gl_FragColor = texture2D(uTexture, vUv); }`;

    const clearShader = `
      precision mediump float; varying vec2 vUv; uniform sampler2D uTexture; uniform float value;
      void main(){ gl_FragColor = value * texture2D(uTexture, vUv); }`;

    const splatShader = `
      precision highp float; varying vec2 vUv;
      uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color;
      uniform vec2 point; uniform float radius;
      void main(){
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p,p)/radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }`;

    const advectionShader = `
      precision highp float; varying vec2 vUv;
      uniform sampler2D uVelocity; uniform sampler2D uSource;
      uniform vec2 texelSize; uniform float dt; uniform float dissipation;
      void main(){
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }`;

    const divergenceShader = `
      precision mediump float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity;
      void main(){
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if(vL.x < 0.0) L = -C.x; if(vR.x > 1.0) R = -C.x;
        if(vT.y > 1.0) T = -C.y; if(vB.y < 0.0) B = -C.y;
        float div = 0.5*(R-L+T-B);
        gl_FragColor = vec4(div,0.0,0.0,1.0);
      }`;

    const curlShader = `
      precision mediump float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity;
      void main(){
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vort = 0.5*(R-L-T+B);
        gl_FragColor = vec4(vort,0.0,0.0,1.0);
      }`;

    const vorticityShader = `
      precision highp float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curlStrength; uniform float dt;
      void main(){
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T)-abs(B), abs(R)-abs(L));
        force /= length(force) + 0.0001;
        force *= curlStrength * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel += force * dt;
        vel = clamp(vel, -1000.0, 1000.0);
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }`;

    const pressureShader = `
      precision mediump float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uDivergence;
      void main(){
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float div = texture2D(uDivergence, vUv).x;
        float pressure = (L+R+B+T-div)*0.25;
        gl_FragColor = vec4(pressure,0.0,0.0,1.0);
      }`;

    const gradientSubtractShader = `
      precision mediump float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uVelocity;
      void main(){
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel -= vec2(R-L, T-B);
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }`;

    const displayShader = `
      precision highp float; varying vec2 vUv; uniform sampler2D uTexture;
      void main(){
        vec3 c = texture2D(uTexture, vUv).rgb;
        float density = max(max(c.r,c.g),c.b);
        density = clamp(density, 0.0, 1.0);
        float alpha = pow(density, 0.72);
        gl_FragColor = vec4(c, alpha);
      }`;

    const progCopy = createProgram(baseVertex, copyShader);
    const progClear = createProgram(baseVertex, clearShader);
    const progSplat = createProgram(baseVertex, splatShader);
    const progAdvection = createProgram(baseVertex, advectionShader);
    const progDivergence = createProgram(baseVertex, divergenceShader);
    const progCurl = createProgram(baseVertex, curlShader);
    const progVorticity = createProgram(baseVertex, vorticityShader);
    const progPressure = createProgram(baseVertex, pressureShader);
    const progGradientSubtract = createProgram(baseVertex, gradientSubtractShader);
    const progDisplay = createProgram(baseVertex, displayShader);
    void progCopy;

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const elemBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 2, 1, 3]), gl.STATIC_DRAW);
    function bindVAO() {
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuffer);
    }
    function blit(target) {
      if (target == null) { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
      else { gl.viewport(0, 0, target.width, target.height); gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    function createFBO(w, h, internalFormat, format, type, param) {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        texture, fbo, width: w, height: h,
        attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; },
      };
    }
    function createDoubleFBO(w, h, internalFormat, format, type, param) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w, height: h,
        get read() { return fbo1; }, set read(v) { fbo1 = v; },
        get write() { return fbo2; }, set write(v) { fbo2 = v; },
        swap() { const tmp = fbo1; fbo1 = fbo2; fbo2 = tmp; },
      };
    }

    function getResolution(res) {
      let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspect < 1) aspect = 1 / aspect;
      const min = Math.round(res);
      const max = Math.round(res * aspect);
      return gl.drawingBufferWidth > gl.drawingBufferHeight ? { width: max, height: min } : { width: min, height: max };
    }

    let simRes = getResolution(params.SIM_RESOLUTION);
    let dyeRes = getResolution(params.DYE_RESOLUTION);

    let dye = createDoubleFBO(dyeRes.width, dyeRes.height, ext.formatRGBA.internalFormat, ext.formatRGBA.format, ext.texType, filtering);
    let velocity = createDoubleFBO(simRes.width, simRes.height, ext.formatRG.internalFormat, ext.formatRG.format, ext.texType, filtering);
    let divergenceFBO = createFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, ext.texType, gl.NEAREST);
    let curlFBO = createFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, ext.texType, gl.NEAREST);
    let pressure = createDoubleFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, ext.texType, gl.NEAREST);

    bindVAO();
    gl.disable(gl.BLEND);

    const COLORS = [
      [0.10, 0.10, 0.11],   // sumi black
      [0.08, 0.16, 0.28],   // indigo
      [0.55, 0.14, 0.09],   // vermilion
      [0.10, 0.22, 0.13],   // pine green
    ];
    // In dark mode the canvas blends with 'screen' (lightens), so ink needs to be
    // luminous rather than dark to remain visible against the dark washi paper.
    const COLORS_DARK = [
      [0.62, 0.60, 0.55],   // pale sumi glow
      [0.20, 0.48, 0.92],   // luminous indigo
      [0.92, 0.34, 0.24],   // luminous vermilion
      [0.30, 0.68, 0.42],   // luminous pine
    ];

    let activeColorIdx = 0;
    let cycleMode = false;
    let cycleCounter = 0;
    let autoPlay = true;

    function hexToRGB(idx) {
      return (darkRef.current ? COLORS_DARK : COLORS)[idx];
    }
    function nextColor() {
      if (cycleMode) { cycleCounter = (cycleCounter + 1) % 4; return cycleCounter; }
      return activeColorIdx;
    }

    let lastTime = Date.now();
    function calcDt() {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016666 * 2);
      lastTime = now;
      return dt;
    }

    function splat(x, y, dx, dy, color) {
      gl.useProgram(progSplat.program);
      gl.uniform1i(progSplat.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(progSplat.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(progSplat.uniforms.point, x, y);
      gl.uniform3f(progSplat.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(progSplat.uniforms.radius, params.SPLAT_RADIUS);
      blit(velocity.write); velocity.swap();

      gl.uniform1i(progSplat.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(progSplat.uniforms.color, color[0], color[1], color[2]);
      blit(dye.write); dye.swap();
    }

    function multipleSplats(n) {
      for (let i = 0; i < n; i++) {
        const color = hexToRGB(nextColor());
        const x = Math.random(); const y = Math.random();
        const dx = 300 * (Math.random() - 0.5); const dy = 300 * (Math.random() - 0.5);
        splat(x, y, dx, dy, color);
      }
    }
    void multipleSplats;

    function step(dt) {
      gl.disable(gl.BLEND);
      gl.useProgram(progCurl.program);
      gl.uniform2f(progCurl.uniforms.texelSize, 1 / simRes.width, 1 / simRes.height);
      gl.uniform1i(progCurl.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFBO);

      gl.useProgram(progVorticity.program);
      gl.uniform2f(progVorticity.uniforms.texelSize, 1 / simRes.width, 1 / simRes.height);
      gl.uniform1i(progVorticity.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(progVorticity.uniforms.uCurl, curlFBO.attach(1));
      gl.uniform1f(progVorticity.uniforms.curlStrength, params.CURL);
      gl.uniform1f(progVorticity.uniforms.dt, dt);
      blit(velocity.write); velocity.swap();

      gl.useProgram(progDivergence.program);
      gl.uniform2f(progDivergence.uniforms.texelSize, 1 / simRes.width, 1 / simRes.height);
      gl.uniform1i(progDivergence.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergenceFBO);

      gl.useProgram(progClear.program);
      gl.uniform1i(progClear.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(progClear.uniforms.value, 0.8);
      blit(pressure.write); pressure.swap();

      gl.useProgram(progPressure.program);
      gl.uniform2f(progPressure.uniforms.texelSize, 1 / simRes.width, 1 / simRes.height);
      gl.uniform1i(progPressure.uniforms.uDivergence, divergenceFBO.attach(0));
      for (let i = 0; i < params.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(progPressure.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write); pressure.swap();
      }

      gl.useProgram(progGradientSubtract.program);
      gl.uniform2f(progGradientSubtract.uniforms.texelSize, 1 / simRes.width, 1 / simRes.height);
      gl.uniform1i(progGradientSubtract.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(progGradientSubtract.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write); velocity.swap();

      gl.useProgram(progAdvection.program);
      gl.uniform2f(progAdvection.uniforms.texelSize, 1 / simRes.width, 1 / simRes.height);
      gl.uniform1i(progAdvection.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(progAdvection.uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(progAdvection.uniforms.dt, dt);
      gl.uniform1f(progAdvection.uniforms.dissipation, (1 - params.VELOCITY_DISSIPATION) * 2.2);
      blit(velocity.write); velocity.swap();

      gl.uniform2f(progAdvection.uniforms.texelSize, 1 / dyeRes.width, 1 / dyeRes.height);
      gl.uniform1i(progAdvection.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(progAdvection.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(progAdvection.uniforms.dissipation, (1 - params.DENSITY_DISSIPATION) * 2.2);
      blit(dye.write); dye.swap();
    }

    function render() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(progDisplay.program);
      gl.uniform1i(progDisplay.uniforms.uTexture, dye.read.attach(0));
      blit(null);
      gl.disable(gl.BLEND);
    }

    /* ---------------- Pointer handling ---------------- */
    const pointers = {};
    function normX(clientX) { return clientX / canvas.width; }
    function normY(clientY) { return 1 - clientY / canvas.height; }

    function startPointer(id, clientX, clientY) {
      pointers[id] = { x: clientX, y: clientY, prevX: clientX, prevY: clientY, moved: false, color: hexToRGB(nextColor()) };
      idleTimer = Date.now();
    }
    function movePointer(id, clientX, clientY) {
      const p = pointers[id];
      if (!p) return;
      p.prevX = p.x; p.prevY = p.y;
      p.x = clientX; p.y = clientY;
      const dx = (p.x - p.prevX) * 8;
      const dy = -(p.y - p.prevY) * 8;
      const dist = Math.hypot(p.x - p.prevX, p.y - p.prevY);
      if (dist > 1) {
        p.moved = true;
        splat(normX(p.x), normY(p.y), dx * params.SPLAT_FORCE * 0.02, dy * params.SPLAT_FORCE * 0.02, p.color);
      }
      idleTimer = Date.now();
    }
    function endPointer(id) {
      const p = pointers[id];
      if (p && !p.moved) {
        splat(normX(p.x), normY(p.y), (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, p.color);
      }
      delete pointers[id];
      idleTimer = Date.now();
    }

    const onPointerDown = (e) => { canvas.setPointerCapture(e.pointerId); startPointer(e.pointerId, e.clientX, e.clientY); };
    const onPointerMove = (e) => {
      if (pointers[e.pointerId] !== undefined) movePointer(e.pointerId, e.clientX, e.clientY);
      else if (e.buttons > 0) startPointer(e.pointerId, e.clientX, e.clientY);
      idleTimer = Date.now();
    };
    const onPointerUp = (e) => endPointer(e.pointerId);
    const onPointerCancel = (e) => endPointer(e.pointerId);

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);
    canvas.style.pointerEvents = 'auto';

    /* ---------------- Auto play (idle ink) ---------------- */
    let idleTimer = Date.now();
    let nextAutoAt = Date.now() + 3000;
    function maybeAutoSplat() {
      if (!autoPlay) return;
      const idleFor = Date.now() - idleTimer;
      if (idleFor > 2600 && Date.now() > nextAutoAt) {
        const n = Math.random() < 0.28 ? 2 : 1;
        for (let i = 0; i < n; i++) {
          const color = hexToRGB(nextColor());
          const x = 0.12 + Math.random() * 0.76;
          const y = 0.12 + Math.random() * 0.76;
          const dx = (Math.random() - 0.5) * 60;
          const dy = (Math.random() - 0.5) * 60;
          splat(x, y, dx, dy, color);
        }
        nextAutoAt = Date.now() + 3400 + Math.random() * 4200;
      }
    }

    /* ---------------- Wash away ---------------- */
    let washing = false, washStart = 0;
    function washAway() { washing = true; washStart = Date.now(); }
    function applyWash() {
      if (!washing) return;
      const t = (Date.now() - washStart) / 1000;
      gl.useProgram(progClear.program);
      gl.uniform1i(progClear.uniforms.uTexture, dye.read.attach(0));
      gl.uniform1f(progClear.uniforms.value, 0.90 - Math.min(t * 0.02, 0.05));
      blit(dye.write); dye.swap();
      for (let i = 0; i < 2; i++) {
        const x = Math.random(), y = 0.9 + Math.random() * 0.1;
        splat(x, y, (Math.random() - 0.5) * 20, -160, [0, 0, 0]);
      }
      if (t > 3.2) washing = false;
    }

    /* ---------------- Resize handling ---------------- */
    function handleResize() {
      if (resizeCanvas()) {
        simRes = getResolution(params.SIM_RESOLUTION);
        dyeRes = getResolution(params.DYE_RESOLUTION);
        dye = createDoubleFBO(dyeRes.width, dyeRes.height, ext.formatRGBA.internalFormat, ext.formatRGBA.format, ext.texType, filtering);
        velocity = createDoubleFBO(simRes.width, simRes.height, ext.formatRG.internalFormat, ext.formatRG.format, ext.texType, filtering);
        divergenceFBO = createFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, ext.texType, gl.NEAREST);
        curlFBO = createFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, ext.texType, gl.NEAREST);
        pressure = createDoubleFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, ext.texType, gl.NEAREST);
        bindVAO();
      }
    }
    function debounce(fn, ms) { let tm; return (...a) => { clearTimeout(tm); tm = setTimeout(() => fn(...a), ms); }; }
    const debouncedResize = debounce(handleResize, 150);
    window.addEventListener('resize', debouncedResize);

    /* ---------------- Controller API exposed to React UI ---------------- */
    controllerRef.current = {
      setColor(idx) { activeColorIdx = idx; cycleMode = false; },
      setCycle(on) { cycleMode = on; },
      setAuto(on) { autoPlay = on; },
      washAway,
    };

    /* ---------------- Initial gentle intro splats (kept away from center text) ---------------- */
    const introSpots = [[0.10, 0.20], [0.90, 0.18], [0.12, 0.85], [0.88, 0.82]];
    function introSplats() {
      const n = window.innerWidth < 700 ? 2 : 3;
      for (let i = 0; i < n; i++) {
        const [x, y] = introSpots[i % introSpots.length];
        const color = hexToRGB(nextColor());
        const dx = 120 * (Math.random() - 0.5), dy = 120 * (Math.random() - 0.5);
        splat(x + (Math.random() - 0.5) * 0.05, y + (Math.random() - 0.5) * 0.05, dx, dy, color);
      }
    }
    const introTimeout = setTimeout(introSplats, 700);

    /* ---------------- Main loop ---------------- */
    let rafActive = true;
    const onVisibility = () => {
      rafActive = document.visibilityState === 'visible';
      if (rafActive) rafId = requestAnimationFrame(loop);
    };
    document.addEventListener('visibilitychange', onVisibility);

    function loop() {
      if (!rafActive || destroyed) return;
      const dt = calcDt();
      step(dt);
      applyWash();
      maybeAutoSplat();
      render();
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      destroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(introTimeout);
      window.removeEventListener('resize', debouncedResize);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return controllerRef;
}
