(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,38408,e=>{"use strict";var i=e.i(30353);e.s(["f",()=>i.D])},60238,e=>{"use strict";var i=e.i(43476),t=e.i(75056),o=e.i(98903),v=e.i(38408),a=e.i(71645),s=e.i(90072);let c=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`,u=`
uniform float uTime;
uniform vec2 uRes;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; } return v; }
void main() {
  vec2 uv = vUv; uv.x *= uRes.x / uRes.y;
  float t = uTime * 0.08;
  vec2 q = vec2(fbm(uv * 2.0 + t), fbm(uv * 2.0 + vec2(5.2, 1.3) - t));
  float n = fbm(uv * 2.5 + q * 2.2 + t * 0.5);
  float bands = 0.5 + 0.5 * sin(n * 12.0 + q.x * 6.0);
  vec3 dark = vec3(0.08, 0.085, 0.1), steel = vec3(0.62, 0.64, 0.68), hi = vec3(0.95, 0.93, 0.88), gold = vec3(0.89, 0.70, 0.25);
  vec3 col = mix(dark, steel, smoothstep(0.2, 0.8, bands));
  col = mix(col, hi, pow(bands, 8.0));
  col = mix(col, gold, smoothstep(0.55, 0.75, n) * 0.35);
  col *= 0.38;
  gl_FragColor = vec4(col, 1.0);
}
`;function r({reduced:e}){let{size:t}=(0,v.f)(),l=(0,a.useMemo)(()=>({uTime:{value:12},uRes:{value:new s.wq(1,1)}}),[]);return(0,o.f)((i,o)=>{l.uRes.value.set(t.width,t.height),e||(l.uTime.value+=o)}),(0,i.jsxs)("mesh",{frustumCulled:!1,children:[(0,i.jsx)("planeGeometry",{args:[2,2]}),(0,i.jsx)("shaderMaterial",{vertexShader:c,fragmentShader:u,uniforms:l,depthWrite:!1})]})}e.s(["default",0,function({reduced:e}){return(0,i.jsx)(t.f,{dpr:[1,1.5],frameloop:e?"demand":"always",children:(0,i.jsx)(r,{reduced:e})})}])},1424,function(e){e.n(e.i(60238))}]);