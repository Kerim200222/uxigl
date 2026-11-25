/**
 * uxiGL OSGL — WebGL GPU Wallpaper Engine & Palettes
 */

export type OSWallpaperId =
  | 'dijios-oxford'
  | 'sequoia'
  | 'sonoma'
  | 'ventura'
  | 'monterey'
  | 'bigsur'
  | 'midnight';

export interface WallpaperPalette {
  name: string;
  isLight: boolean;
  preview: string;
  fallbackCss: string;
  colorA: [number, number, number];
  colorB: [number, number, number];
  colorC: [number, number, number];
  colorBg: [number, number, number];
}

export const OS_WALLPAPERS: Record<OSWallpaperId, WallpaperPalette> = {
  'dijios-oxford': {
    name: 'DijiOS Oxford',
    isLight: false,
    preview: 'linear-gradient(135deg, #002147, #1d3557, #457b9d)',
    fallbackCss: 'linear-gradient(145deg, #001833 0%, #002147 52%, #1d3557 100%)',
    colorA: [0.07, 0.34, 0.56],
    colorB: [0.27, 0.48, 0.62],
    colorC: [0.11, 0.21, 0.38],
    colorBg: [0.02, 0.08, 0.18],
  },
  sequoia: {
    name: 'Sequoia Wave',
    isLight: false,
    preview: 'linear-gradient(135deg, #0d9488, #ec4899, #f59e0b)',
    fallbackCss: 'linear-gradient(135deg, #0f766e 0%, #7c3aed 50%, #db2777 100%)',
    colorA: [0.08, 0.72, 0.65],
    colorB: [0.95, 0.25, 0.45],
    colorC: [0.96, 0.62, 0.08],
    colorBg: [0.07, 0.14, 0.28],
  },
  sonoma: {
    name: 'Sonoma Horizon',
    isLight: false,
    preview: 'linear-gradient(135deg, #0284c7, #2563eb, #10b981)',
    fallbackCss: 'linear-gradient(145deg, #0c4a6e 0%, #1d4ed8 55%, #065f46 100%)',
    colorA: [0.18, 0.72, 0.96],
    colorB: [0.06, 0.73, 0.51],
    colorC: [0.15, 0.39, 0.92],
    colorBg: [0.04, 0.16, 0.32],
  },
  ventura: {
    name: 'Ventura Silk',
    isLight: false,
    preview: 'linear-gradient(135deg, #f97316, #fbbf24, #1e3a8a)',
    fallbackCss: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #c2410c 100%)',
    colorA: [0.98, 0.52, 0.16],
    colorB: [0.98, 0.8, 0.15],
    colorC: [0.16, 0.32, 0.72],
    colorBg: [0.06, 0.1, 0.24],
  },
  monterey: {
    name: 'Monterey Dusk',
    isLight: false,
    preview: 'linear-gradient(135deg, #9333ea, #ec4899, #312e81)',
    fallbackCss: 'linear-gradient(155deg, #1e1b4b 0%, #581c87 52%, #831843 100%)',
    colorA: [0.92, 0.28, 0.6],
    colorB: [0.55, 0.36, 0.96],
    colorC: [0.24, 0.18, 0.62],
    colorBg: [0.09, 0.06, 0.22],
  },
  bigsur: {
    name: 'Big Sur Pastel',
    isLight: true,
    preview: 'linear-gradient(135deg, #93c5fd, #fbcfe8, #fde68a)',
    fallbackCss: 'linear-gradient(135deg, #dbeafe 0%, #fce7f3 52%, #fef3c7 100%)',
    colorA: [0.58, 0.77, 0.99],
    colorB: [0.98, 0.81, 0.91],
    colorC: [0.99, 0.9, 0.54],
    colorBg: [0.88, 0.93, 0.99],
  },
  midnight: {
    name: 'Midnight Studio',
    isLight: false,
    preview: 'linear-gradient(135deg, #090d16, #1e293b, #0284c7)',
    fallbackCss: 'linear-gradient(160deg, #06080e 0%, #0f172a 60%, #111827 100%)',
    colorA: [0.06, 0.55, 0.88],
    colorB: [0.39, 0.4, 0.95],
    colorC: [0.12, 0.16, 0.28],
    colorBg: [0.02, 0.03, 0.06],
  },
};

const VERTEX_SHADER = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_dark;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform vec3 u_colorC;
uniform vec3 u_colorBg;

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float t = u_time * 0.18;
  float w1 = sin(uv.x * 3.1 + t + sin(uv.y * 2.4 - t * 0.7)) * 0.5 + 0.5;
  float w2 = cos(uv.y * 2.8 - t * 0.8 + sin(uv.x * 2.2 + t * 0.5)) * 0.5 + 0.5;
  float w3 = sin((uv.x + uv.y) * 2.5 + t * 0.6) * 0.5 + 0.5;

  vec3 baseBg = mix(u_colorBg, u_colorBg * 0.28 + vec3(0.02, 0.03, 0.06), u_dark);
  vec3 cA = mix(u_colorA, u_colorA * 0.52, u_dark);
  vec3 cB = mix(u_colorB, u_colorB * 0.50, u_dark);
  vec3 cC = mix(u_colorC, u_colorC * 0.48, u_dark);

  vec3 col = mix(baseBg, cA, smoothstep(0.15, 0.85, w1) * 0.85);
  col = mix(col, cB, smoothstep(0.25, 0.90, w2) * 0.75);
  col = mix(col, cC, smoothstep(0.35, 0.95, w3) * 0.55);
  gl_FragColor = vec4(col, 1.0);
}
`;

export function startOSWebGLWallpaper(
  canvas: HTMLCanvasElement,
  getPalette: () => WallpaperPalette,
  getIsDark: () => boolean = () => false,
  onReady?: (active: boolean) => void,
  isPaused?: () => boolean
): () => void {
  const gl =
    canvas.getContext('webgl2', { antialias: false, powerPreference: 'high-performance' }) ||
    canvas.getContext('webgl', { antialias: false, powerPreference: 'high-performance' });
  if (!gl) {
    onReady?.(false);
    return () => {};
  }

  const compile = (type: number, src: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) {
    onReady?.(false);
    return () => {};
  }
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    onReady?.(false);
    return () => {};
  }

  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uDark = gl.getUniformLocation(prog, 'u_dark');
  const uColorA = gl.getUniformLocation(prog, 'u_colorA');
  const uColorB = gl.getUniformLocation(prog, 'u_colorB');
  const uColorC = gl.getUniformLocation(prog, 'u_colorC');
  const uColorBg = gl.getUniformLocation(prog, 'u_colorBg');

  let rafId = 0;
  let lastW = 0;
  let lastH = 0;
  let lastFrameTime = 0;
  const start = performance.now();
  onReady?.(true);

  const render = (now: number) => {
    rafId = requestAnimationFrame(render);
    if (typeof document !== 'undefined' && document.hidden) return;
    if (isPaused?.()) return;
    if (now - lastFrameTime < 45) return;
    lastFrameTime = now;

    // 0.25x resolution scale: GPU bilinear upscale gives smooth gradients at ~94% less fragment cost
    const w = Math.max(320, Math.floor(canvas.clientWidth * 0.25));
    const h = Math.max(180, Math.floor(canvas.clientHeight * 0.25));
    if (w > 0 && h > 0 && (w !== lastW || h !== lastH)) {
      canvas.width = w;
      canvas.height = h;
      lastW = w;
      lastH = h;
      gl.viewport(0, 0, w, h);
    }
    const pal = getPalette();
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.uniform1f(uDark, getIsDark() ? 1.0 : 0.0);
    gl.uniform3fv(uColorA, pal.colorA);
    gl.uniform3fv(uColorB, pal.colorB);
    gl.uniform3fv(uColorC, pal.colorC);
    gl.uniform3fv(uColorBg, pal.colorBg);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  rafId = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(rafId);
    gl.deleteBuffer(buf);
    gl.deleteProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  };
}
