import { Color, ShaderMaterial, Vector2 } from "three";

const vertexShader = `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uMotion;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vFold;

  float taper(float u) { return smoothstep(0.0, .13, u) * smoothstep(1.0, .87, u); }

  void main() {
    vUv = uv;
    float x = position.x;
    float t = uTime * .23 * uMotion;
    float width = (.24 + .64 * taper(uv.x)) * position.y;
    float waveA = sin(x * .78 + t) * .52;
    float waveB = sin(x * 1.46 - t * 1.37 + 1.2) * .18;
    float fold = sin(x * .58 - t * .72) * 1.12 + sin(x * 1.18 + t * .41) * .28;
    float pointerDistance = abs(uv.x - uPointer.x);
    float ripple = exp(-pointerDistance * pointerDistance * 42.0) * (uPointer.y - .5) * .72;
    float twist = sin(x * .92 + t * 1.31) * 1.25 + ripple;
    vec3 p = vec3(x, waveA + waveB, fold);
    p.y += width * cos(twist);
    p.z += width * sin(twist);
    p.y += x * .055;
    vFold = fold + twist * .18;
    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec3 uGraphite;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vFold;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1.,0.)), f.x), mix(hash(i+vec2(0.,1.)), hash(i+vec2(1.,1.)), f.x), f.y);
  }

  void main() {
    vec3 dx = dFdx(vWorld); vec3 dy = dFdy(vWorld);
    vec3 normal = normalize(cross(dx, dy));
    if (!gl_FrontFacing) normal *= -1.0;
    vec3 viewDir = normalize(cameraPosition - vWorld);
    float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.35);
    float edge = pow(1.0 - abs(vUv.y * 2.0 - 1.0), 5.0);
    float field = noise(vWorld.xy * 1.35 + vec2(uTime * .035, -uTime * .022));
    float streak = pow(max(0.0, sin(vUv.x * 42.0 + vFold * 5.5 - uTime * .55)), 18.0);
    streak += pow(max(0.0, sin(vUv.x * 17.0 - vUv.y * 8.0 + uTime * .31)), 28.0) * .65;
    float silver = clamp(fresnel * 1.32 + streak * .82 + edge * .42, 0.0, 1.0);
    vec3 spectral = mix(vec3(.08,.42,.58), vec3(.48,.12,.62), smoothstep(.25,.8,vUv.x));
    spectral = mix(spectral, vec3(.72,.08,.045), step(.91, fract(vUv.x * 3.0 + uTime * .012)));
    vec3 base = uGraphite * (.48 + field * .34);
    vec3 color = base + vec3(silver) * vec3(.88,.93,1.0);
    color += spectral * fresnel * .19;
    float alpha = .40 + fresnel * .50 + streak * .18;
    gl_FragColor = vec4(color, clamp(alpha, .34, .96));
  }
`;

export function createLiquidMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: 2,
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new Vector2(0.5, 0.5) },
      uMotion: { value: 1 },
      uGraphite: { value: new Color("#101717") },
    },
    vertexShader,
    fragmentShader,
  });
}
