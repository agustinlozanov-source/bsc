"use client";

import { useEffect, useRef } from "react";

/**
 * Gradiente animado por WebGL (variante del "mesh gradient" de Stripe).
 *
 * Correcciones respecto al componente original:
 *  - El shader indexa `u_active_colors[i + 1]` sobre un `vec4`, así que solo
 *    admite 4 colores (base + 3 capas de onda). Con más, el índice se sale de
 *    rango y el resultado es indefinido. Aquí se recorta a 4 explícitamente.
 *  - El original dimensionaba el canvas con `window.innerWidth/Height`; dentro
 *    de un contenedor más pequeño eso deforma la onda. Ahora mide el contenedor
 *    con un ResizeObserver.
 *  - Se detiene con `prefers-reduced-motion`, cuando la pestaña está oculta y
 *    cuando el bloque sale de pantalla — no gasta batería animando lo que nadie ve.
 *  - Si WebGL no está disponible no pinta nada: queda el fondo sólido de abajo.
 */

function normalizeColor(hexCode: number): number[] {
  return [
    ((hexCode >> 16) & 255) / 255,
    ((hexCode >> 8) & 255) / 255,
    (255 & hexCode) / 255,
  ];
}

class MiniGl {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  meshes: any[] = [];
  commonUniforms: any;
  width = 1;
  height = 1;
  Material: any;
  Uniform: any;
  PlaneGeometry: any;
  Mesh: any;
  Attribute: any;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = this.canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    if (!gl) throw new Error("WebGL no disponible");
    this.gl = gl;

    const context = this.gl;
    const _miniGl = this;

    this.Uniform = class {
      type = "float";
      value: any;
      typeFn: string;
      excludeFrom?: string;
      transpose?: boolean;

      constructor(e: any) {
        Object.assign(this, e);
        const typeMap: Record<string, string> = {
          float: "1f",
          int: "1i",
          vec2: "2fv",
          vec3: "3fv",
          vec4: "4fv",
          mat4: "Matrix4fv",
        };
        this.typeFn = typeMap[this.type] || "1f";
      }

      update(location: any): void {
        if (this.value === undefined || location === null) return;
        const isMatrix = this.typeFn.indexOf("Matrix") === 0;
        const fn = `uniform${this.typeFn}`;
        if (isMatrix) {
          (context as any)[fn](location, this.transpose || false, this.value);
        } else {
          (context as any)[fn](location, this.value);
        }
      }

      getDeclaration(name: string, type: string, length?: number): string {
        if (this.excludeFrom === type) return "";

        if (this.type === "array") {
          return (
            this.value[0].getDeclaration(name, type, this.value.length) +
            `\nconst int ${name}_length = ${this.value.length};`
          );
        }

        if (this.type === "struct") {
          let nameNoPrefix = name.replace("u_", "");
          nameNoPrefix =
            nameNoPrefix.charAt(0).toUpperCase() + nameNoPrefix.slice(1);
          const fields = Object.entries(this.value)
            .map(([n, u]: [string, any]) =>
              u.getDeclaration(n, type).replace(/^uniform/, ""),
            )
            .join("");
          return `uniform struct ${nameNoPrefix} {\n${fields}\n} ${name}${
            length ? `[${length}]` : ""
          };`;
        }

        return `uniform ${this.type} ${name}${length ? `[${length}]` : ""};`;
      }
    };

    this.Attribute = class {
      type: number = context.FLOAT;
      normalized = false;
      buffer: WebGLBuffer;
      target!: number;
      size!: number;
      values?: Float32Array | Uint16Array;

      constructor(e: any) {
        this.buffer = context.createBuffer()!;
        Object.assign(this, e);
      }

      update(): void {
        if (this.values) {
          context.bindBuffer(this.target, this.buffer);
          context.bufferData(this.target, this.values, context.STATIC_DRAW);
        }
      }

      attach(e: string, t: WebGLProgram): number {
        const n = context.getAttribLocation(t, e);
        if (this.target === context.ARRAY_BUFFER) {
          context.bindBuffer(this.target, this.buffer);
          context.enableVertexAttribArray(n);
          context.vertexAttribPointer(n, this.size, this.type, this.normalized, 0, 0);
        }
        return n;
      }

      use(e: number): void {
        context.bindBuffer(this.target, this.buffer);
        if (this.target === context.ARRAY_BUFFER) {
          context.enableVertexAttribArray(e);
          context.vertexAttribPointer(e, this.size, this.type, this.normalized, 0, 0);
        }
      }
    };

    this.Material = class {
      uniforms: any;
      uniformInstances: any[] = [];
      program!: WebGLProgram;

      constructor(vertexShaders: string, fragments: string, uniforms: any = {}) {
        const material = this;

        function getShader(type: number, source: string): WebGLShader {
          const shader = context.createShader(type)!;
          context.shaderSource(shader, source);
          context.compileShader(shader);
          if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
            const log = context.getShaderInfoLog(shader);
            throw new Error(`Error al compilar el shader: ${log}`);
          }
          return shader;
        }

        function getUniformDeclarations(uniforms: any, type: string): string {
          return Object.entries(uniforms)
            .map(([uniform, value]: [string, any]) =>
              value.getDeclaration(uniform, type),
            )
            .join("\n");
        }

        material.uniforms = uniforms;
        const prefix = "precision highp float;";

        const vertexSource = `
          ${prefix}
          attribute vec4 position;
          attribute vec2 uv;
          attribute vec2 uvNorm;
          ${getUniformDeclarations(_miniGl.commonUniforms, "vertex")}
          ${getUniformDeclarations(uniforms, "vertex")}
          ${vertexShaders}
        `;

        const fragmentSource = `
          ${prefix}
          ${getUniformDeclarations(_miniGl.commonUniforms, "fragment")}
          ${getUniformDeclarations(uniforms, "fragment")}
          ${fragments}
        `;

        material.program = context.createProgram()!;
        context.attachShader(material.program, getShader(context.VERTEX_SHADER, vertexSource));
        context.attachShader(material.program, getShader(context.FRAGMENT_SHADER, fragmentSource));
        context.linkProgram(material.program);

        if (!context.getProgramParameter(material.program, context.LINK_STATUS)) {
          const log = context.getProgramInfoLog(material.program);
          throw new Error(`Error al enlazar el programa: ${log}`);
        }

        context.useProgram(material.program);
        material.attachUniforms(undefined, _miniGl.commonUniforms);
        material.attachUniforms(undefined, material.uniforms);
      }

      attachUniforms(name: string | undefined, uniforms: any): void {
        if (name === undefined) {
          Object.entries(uniforms).forEach(([n, u]) => this.attachUniforms(n, u));
        } else if (uniforms.type === "array") {
          uniforms.value.forEach((u: any, i: number) =>
            this.attachUniforms(`${name}[${i}]`, u),
          );
        } else if (uniforms.type === "struct") {
          Object.entries(uniforms.value).forEach(([u, i]) =>
            this.attachUniforms(`${name}.${u}`, i),
          );
        } else {
          this.uniformInstances.push({
            uniform: uniforms,
            location: context.getUniformLocation(this.program, name),
          });
        }
      }
    };

    this.PlaneGeometry = class {
      width = 1;
      height = 1;
      attributes: any;
      vertexCount = 0;
      xSegCount = 0;
      ySegCount = 0;

      constructor() {
        this.attributes = {
          position: new _miniGl.Attribute({ target: context.ARRAY_BUFFER, size: 3 }),
          uv: new _miniGl.Attribute({ target: context.ARRAY_BUFFER, size: 2 }),
          uvNorm: new _miniGl.Attribute({ target: context.ARRAY_BUFFER, size: 2 }),
          index: new _miniGl.Attribute({
            target: context.ELEMENT_ARRAY_BUFFER,
            size: 3,
            type: context.UNSIGNED_SHORT,
          }),
        };
      }

      setTopology(xSegs = 1, ySegs = 1): void {
        this.xSegCount = xSegs;
        this.ySegCount = ySegs;
        this.vertexCount = (this.xSegCount + 1) * (this.ySegCount + 1);
        const quadCount = this.xSegCount * this.ySegCount * 2;

        this.attributes.uv.values = new Float32Array(2 * this.vertexCount);
        this.attributes.uvNorm.values = new Float32Array(2 * this.vertexCount);
        this.attributes.index.values = new Uint16Array(3 * quadCount);

        for (let y = 0; y <= this.ySegCount; y++) {
          for (let x = 0; x <= this.xSegCount; x++) {
            const i = y * (this.xSegCount + 1) + x;
            this.attributes.uv.values[2 * i] = x / this.xSegCount;
            this.attributes.uv.values[2 * i + 1] = 1 - y / this.ySegCount;
            this.attributes.uvNorm.values[2 * i] = (x / this.xSegCount) * 2 - 1;
            this.attributes.uvNorm.values[2 * i + 1] = 1 - (y / this.ySegCount) * 2;

            if (x < this.xSegCount && y < this.ySegCount) {
              const s = y * this.xSegCount + x;
              this.attributes.index.values[6 * s] = i;
              this.attributes.index.values[6 * s + 1] = i + 1 + this.xSegCount;
              this.attributes.index.values[6 * s + 2] = i + 1;
              this.attributes.index.values[6 * s + 3] = i + 1;
              this.attributes.index.values[6 * s + 4] = i + 1 + this.xSegCount;
              this.attributes.index.values[6 * s + 5] = i + 2 + this.xSegCount;
            }
          }
        }

        this.attributes.uv.update();
        this.attributes.uvNorm.update();
        this.attributes.index.update();
      }

      setSize(width = 1, height = 1): void {
        this.width = width;
        this.height = height;
        this.attributes.position.values = new Float32Array(3 * this.vertexCount);

        const offsetX = width / -2;
        const offsetY = height / -2;
        const segWidth = width / this.xSegCount;
        const segHeight = height / this.ySegCount;

        for (let y = 0; y <= this.ySegCount; y++) {
          const posY = offsetY + y * segHeight;
          for (let x = 0; x <= this.xSegCount; x++) {
            const posX = offsetX + x * segWidth;
            const idx = y * (this.xSegCount + 1) + x;
            this.attributes.position.values[3 * idx] = posX;
            this.attributes.position.values[3 * idx + 1] = -posY;
            this.attributes.position.values[3 * idx + 2] = 0;
          }
        }

        this.attributes.position.update();
      }
    };

    this.Mesh = class {
      geometry: any;
      material: any;
      attributeInstances: any[] = [];

      constructor(geometry: any, material: any) {
        this.geometry = geometry;
        this.material = material;

        Object.entries(this.geometry.attributes).forEach(
          ([e, attribute]: [string, any]) => {
            this.attributeInstances.push({
              attribute,
              location: attribute.attach(e, this.material.program),
            });
          },
        );

        _miniGl.meshes.push(this);
      }

      draw(): void {
        context.useProgram(this.material.program);
        this.material.uniformInstances.forEach(({ uniform, location }: any) =>
          uniform.update(location),
        );
        this.attributeInstances.forEach(({ attribute, location }: any) =>
          attribute.use(location),
        );
        context.drawElements(
          context.TRIANGLES,
          this.geometry.attributes.index.values.length,
          context.UNSIGNED_SHORT,
          0,
        );
      }
    };

    const identityMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    this.commonUniforms = {
      projectionMatrix: new this.Uniform({ type: "mat4", value: identityMatrix }),
      modelViewMatrix: new this.Uniform({ type: "mat4", value: identityMatrix }),
      resolution: new this.Uniform({ type: "vec2", value: [1, 1] }),
      aspectRatio: new this.Uniform({ type: "float", value: 1 }),
    };
  }

  setSize(w = 640, h = 480): void {
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
    this.commonUniforms.resolution.value = [w, h];
    this.commonUniforms.aspectRatio.value = w / h;
  }

  setOrthographicCamera(): void {
    this.commonUniforms.projectionMatrix.value = [
      2 / this.width, 0, 0, 0,
      0, 2 / this.height, 0, 0,
      0, 0, -0.001, 0,
      0, 0, 0, 1,
    ];
  }

  render(): void {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clearDepth(1);
    this.meshes.forEach((m) => m.draw());
  }

  dispose(): void {
    const lose = this.gl.getExtension("WEBGL_lose_context");
    lose?.loseContext();
  }
}

const VERTEX_SHADER = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 blendNormal(vec3 base, vec3 blend) { return blend; }
vec3 blendNormal(vec3 base, vec3 blend, float opacity) { return (blend * opacity + base * (1.0 - opacity)); }

varying vec3 v_color;

void main() {
  float time = u_time * u_global.noiseSpeed;
  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;
  float tilt = resolution.y / 2.0 * uvNorm.y;
  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;
  float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);

  float noise = snoise(vec3(
    noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,
    noiseCoord.y * u_vertDeform.noiseFreq.y,
    time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed
  )) * u_vertDeform.noiseAmp;

  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);
  noise = max(0.0, noise);

  vec3 pos = vec3(position.x, position.y + tilt + incline + noise - offset, position.z);

  v_color = u_baseColor;

  for (int i = 0; i < u_waveLayers_length; i++) {
    if (u_active_colors[i + 1] == 1.) {
      WaveLayers layer = u_waveLayers[i];
      float layerNoise = smoothstep(
        layer.noiseFloor,
        layer.noiseCeil,
        snoise(vec3(
          noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,
          noiseCoord.y * layer.noiseFreq.y,
          time * layer.noiseSpeed + layer.noiseSeed
        )) / 2.0 + 0.5
      );
      v_color = blendNormal(v_color, layer.color, pow(layerNoise, 4.));
    }
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

const FRAGMENT_SHADER = `
varying vec3 v_color;

void main() {
  vec3 color = v_color;
  if (u_darken_top == 1.0) {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;
  }
  gl_FragColor = vec4(color, 1.0);
}`;

type DeformOptions = {
  incline?: number;
  offsetTop?: number;
  offsetBottom?: number;
  noiseFreq?: [number, number];
  noiseAmp?: number;
  noiseSpeed?: number;
  noiseFlow?: number;
  noiseSeed?: number;
};

class Gradient {
  canvas: HTMLCanvasElement;
  minigl: MiniGl;
  mesh: any;
  time = 0;
  last = 0;
  animationId?: number;
  isPlaying = false;

  constructor(
    canvas: HTMLCanvasElement,
    colors: string[],
    options: {
      shadowPower: number;
      darkenTop: boolean;
      noiseSpeed: number;
      noiseFrequency: [number, number];
      deform: DeformOptions;
    },
  ) {
    this.canvas = canvas;
    this.minigl = new MiniGl(canvas);

    // El shader indexa `u_active_colors[i + 1]` sobre un vec4 → 4 colores máximo.
    const sectionColors = colors
      .slice(0, 4)
      .map((hex) => normalizeColor(parseInt(hex.replace("#", "0x"), 16)));

    const uniforms: any = {
      u_time: new this.minigl.Uniform({ value: 0 }),
      u_shadow_power: new this.minigl.Uniform({ value: options.shadowPower }),
      u_darken_top: new this.minigl.Uniform({ value: options.darkenTop ? 1 : 0 }),
      u_active_colors: new this.minigl.Uniform({ value: [1, 1, 1, 1], type: "vec4" }),
      u_global: new this.minigl.Uniform({
        value: {
          noiseFreq: new this.minigl.Uniform({
            value: options.noiseFrequency,
            type: "vec2",
          }),
          noiseSpeed: new this.minigl.Uniform({ value: options.noiseSpeed }),
        },
        type: "struct",
      }),
      u_vertDeform: new this.minigl.Uniform({
        value: {
          incline: new this.minigl.Uniform({ value: options.deform.incline ?? 0 }),
          offsetTop: new this.minigl.Uniform({ value: options.deform.offsetTop ?? -0.5 }),
          offsetBottom: new this.minigl.Uniform({ value: options.deform.offsetBottom ?? -0.5 }),
          noiseFreq: new this.minigl.Uniform({
            value: options.deform.noiseFreq ?? [3, 4],
            type: "vec2",
          }),
          noiseAmp: new this.minigl.Uniform({ value: options.deform.noiseAmp ?? 320 }),
          noiseSpeed: new this.minigl.Uniform({ value: options.deform.noiseSpeed ?? 10 }),
          noiseFlow: new this.minigl.Uniform({ value: options.deform.noiseFlow ?? 3 }),
          noiseSeed: new this.minigl.Uniform({ value: options.deform.noiseSeed ?? 5 }),
        },
        type: "struct",
        excludeFrom: "fragment",
      }),
      u_baseColor: new this.minigl.Uniform({
        value: sectionColors[0],
        type: "vec3",
        excludeFrom: "fragment",
      }),
      u_waveLayers: new this.minigl.Uniform({
        value: [],
        excludeFrom: "fragment",
        type: "array",
      }),
    };

    for (let i = 1; i < sectionColors.length; i++) {
      uniforms.u_waveLayers.value.push(
        new this.minigl.Uniform({
          value: {
            color: new this.minigl.Uniform({ value: sectionColors[i], type: "vec3" }),
            noiseFreq: new this.minigl.Uniform({
              value: [2 + i / sectionColors.length, 3 + i / sectionColors.length],
              type: "vec2",
            }),
            noiseSpeed: new this.minigl.Uniform({ value: 11 + 0.3 * i }),
            noiseFlow: new this.minigl.Uniform({ value: 6.5 + 0.3 * i }),
            noiseSeed: new this.minigl.Uniform({ value: 5 + 10 * i }),
            noiseFloor: new this.minigl.Uniform({ value: 0.1 }),
            noiseCeil: new this.minigl.Uniform({ value: 0.63 + 0.07 * i }),
          },
          type: "struct",
        }),
      );
    }

    const material = new this.minigl.Material(VERTEX_SHADER, FRAGMENT_SHADER, uniforms);
    const geometry = new this.minigl.PlaneGeometry();
    this.mesh = new this.minigl.Mesh(geometry, material);
  }

  /** Dimensiones del contenedor, no de la ventana. */
  resize(width: number, height: number): void {
    if (width < 1 || height < 1) return;

    this.minigl.setSize(width, height);
    this.minigl.setOrthographicCamera();

    const xSegCount = Math.max(1, Math.ceil(width * 0.02));
    const ySegCount = Math.max(1, Math.ceil(height * 0.05));

    // Regenerar la topología reasigna buffers; solo si de verdad cambió.
    if (
      xSegCount !== this.mesh.geometry.xSegCount ||
      ySegCount !== this.mesh.geometry.ySegCount
    ) {
      this.mesh.geometry.setTopology(xSegCount, ySegCount);
    }
    this.mesh.geometry.setSize(width, height);

    // Un fotograma para que no quede en blanco mientras está pausado.
    this.minigl.render();
  }

  animate = (timestamp: number): void => {
    if (!this.isPlaying) return;
    this.time += Math.min(timestamp - this.last, 1000 / 15);
    this.last = timestamp;
    this.mesh.material.uniforms.u_time.value = this.time;
    this.minigl.render();
    this.animationId = requestAnimationFrame(this.animate);
  };

  start(): void {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.last = performance.now();
    this.animationId = requestAnimationFrame(this.animate);
  }

  stop(): void {
    this.isPlaying = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }

  dispose(): void {
    this.stop();
    this.minigl.dispose();
  }
}

export interface GradientWaveProps {
  /** Máximo 4: color base + 3 capas de onda. Los extra se descartan. */
  colors?: string[];
  isPlaying?: boolean;
  className?: string;
  shadowPower?: number;
  darkenTop?: boolean;
  noiseSpeed?: number;
  noiseFrequency?: [number, number];
  deform?: DeformOptions;
}

const DEFAULT_COLORS = ["#18490e", "#123a0b", "#2d6b1e", "#1f5a14"];
const DEFAULT_NOISE_FREQUENCY: [number, number] = [0.0001, 0.0009];
const DEFAULT_DEFORM: DeformOptions = { incline: 0.5, noiseAmp: 250, noiseFlow: 5 };

export function GradientWave({
  colors = DEFAULT_COLORS,
  isPlaying = true,
  className = "",
  shadowPower = 8,
  darkenTop = false,
  noiseSpeed = 0.00001,
  noiseFrequency = DEFAULT_NOISE_FREQUENCY,
  deform = DEFAULT_DEFORM,
}: GradientWaveProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Las props van por ref para que el efecto no dependa de identidades de
  // objeto: un literal en línea reinicializaría WebGL en cada render.
  const optionsRef = useRef({ shadowPower, darkenTop, noiseSpeed, noiseFrequency, deform });
  optionsRef.current = { shadowPower, darkenTop, noiseSpeed, noiseFrequency, deform };

  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;

  /** La instalada por el efecto; permite reaccionar a cambios de `isPlaying`. */
  const syncRef = useRef<() => void>(() => {});

  const colorKey = colors.join(",");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const canvas = document.createElement("canvas");
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
    });
    container.appendChild(canvas);

    let gradient: Gradient;
    try {
      gradient = new Gradient(canvas, colorKey.split(","), optionsRef.current);
    } catch (error) {
      // Sin WebGL el bloque simplemente conserva su fondo sólido.
      console.warn("GradientWave inactivo:", error);
      container.removeChild(canvas);
      return;
    }

    let visible = true;

    function sync() {
      if (!gradient) return;
      const shouldPlay = playingRef.current && visible && !reduced.matches && !document.hidden;
      if (shouldPlay) gradient.start();
      else gradient.stop();
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      gradient.resize(Math.round(width), Math.round(height));
    });
    resizeObserver.observe(container);

    // No animar lo que está fuera de pantalla.
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    intersectionObserver.observe(container);

    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    syncRef.current = sync;
    sync();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      syncRef.current = () => {};
      gradient.dispose();
      if (container.contains(canvas)) container.removeChild(canvas);
    };
  }, [colorKey]);

  // `isPlaying` se lee por ref dentro del efecto; esto lo hace reaccionar.
  useEffect(() => {
    syncRef.current();
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden ${className}`}
    />
  );
}
