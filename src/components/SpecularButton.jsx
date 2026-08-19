import { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';
import './SpecularButton.css';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + vec2(r);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float shapeSDF(vec2 p) {
  return sdRoundedRect(p, uHalfSize, uRadius);
}

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  return exp(-1.4 * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = shapeSDF(p);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  // Angular directional specular beam
  vec2 nEll = normalize(p / (uHalfSize + vec2(1e-4)));
  float phi = acos(clamp(dot(nEll, L), -1.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  
  float line = gaussianLine(d, uThickness);
  float hi = line * rim * uIntensity;

  vec3 col = uLineColor * hi;
  fragColor = vec4(col, hi);
}
`;

const SpecularButton = ({
  children = 'Get Started',
  variant = 'primary', // 'primary' | 'quiet' | 'ghost'
  size = 'md',
  radius = 16,
  textColor,
  lineColor = '#ffffff',
  intensity = 1.4,
  shineSize = 24,
  shineFade = 55,
  thickness = 2.0,
  speed = 0.4,
  followMouse = true,
  proximity = 300,
  autoAnimate = false,
  disabled = false,
  onClick,
  href,
  target,
  rel,
  className = '',
  type = 'button',
  style = {}
}) => {
  const btnRef = useRef(null);
  const fxRef = useRef(null);
  const propsRef = useRef({});

  propsRef.current = { radius, lineColor, intensity, shineSize, shineFade, thickness, speed, followMouse, proximity, autoAnimate };

  useEffect(() => {
    const btn = btnRef.current;
    const fx = fxRef.current;
    if (!btn || !fx) return;

    let gl, ro, raf = 0;
    let onPointerMove;

    try {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr });
      gl = renderer.gl;
      if (!gl) return;

      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      const geometry = new Triangle(gl);
      if (geometry.attributes.uv) delete geometry.attributes.uv;

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uCenter: { value: [0, 0] },
          uHalfSize: { value: [1, 1] },
          uRadius: { value: 0 },
          uAngle: { value: 2.4 },
          uPx: { value: dpr },
          uLineColor: { value: [1, 1, 1] },
          uIntensity: { value: 1.2 },
          uShineSize: { value: 0.35 },
          uShineFade: { value: 0.8 },
          uThickness: { value: 2.0 * dpr }
        }
      });

      const mesh = new Mesh(gl, { geometry, program });
      fx.appendChild(gl.canvas);

      let lastW = 0;
      let lastH = 0;

      const updateDimensions = () => {
        const w = btn.offsetWidth;
        const h = btn.offsetHeight;
        if (w === 0 || h === 0 || (w === lastW && h === lastH)) return;
        lastW = w;
        lastH = h;
        renderer.setSize(w, h);
        program.uniforms.uCenter.value = [(w / 2) * dpr, (h / 2) * dpr];
        program.uniforms.uHalfSize.value = [(w / 2) * dpr, (h / 2) * dpr];
        program.uniforms.uRadius.value = Math.min(propsRef.current.radius, Math.min(w, h) / 2) * dpr;
      };

      updateDimensions();

      ro = new ResizeObserver(updateDimensions);
      ro.observe(btn);

      let pointerAngle = null;
      let proximityT = 0;
      onPointerMove = e => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
        const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
        const dist = Math.hypot(dx, dy);

        if (dist === 0) {
          const nx = (e.clientX - cx) / (rect.width / 2);
          const ny = (cy - e.clientY) / (rect.height / 2);
          pointerAngle = Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.3 + ny * 0.15;
        } else {
          pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx);
        }
        const t = Math.max(0, 1 - dist / Math.max(propsRef.current.proximity, 1));
        proximityT = t * t * (3 - 2 * t);
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });

      let angle = 2.4;
      let idleAngle = 2.4;
      let bright = 0;
      let last = performance.now();

      const lineC = new Color();

      const update = now => {
        raf = requestAnimationFrame(update);
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const p = propsRef.current;

        idleAngle = (idleAngle + dt * p.speed) % (Math.PI * 2);
        const targetA = (p.followMouse && pointerAngle !== null) ? pointerAngle : idleAngle;
        let diff = targetA - angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        angle += diff * Math.min(dt * 8, 1);

        const targetB = (p.autoAnimate || pointerAngle !== null) ? (p.followMouse ? proximityT : 1) : 0;
        bright += (targetB - bright) * Math.min(dt * 6, 1);

        lineC.set(p.lineColor);
        program.uniforms.uAngle.value = angle;
        program.uniforms.uLineColor.value = [lineC.r, lineC.g, lineC.b];
        program.uniforms.uIntensity.value = p.intensity * bright;
        program.uniforms.uShineSize.value = (p.shineSize * Math.PI) / 180;
        program.uniforms.uShineFade.value = (p.shineFade * Math.PI) / 180;
        program.uniforms.uThickness.value = p.thickness * dpr;

        renderer.render({ scene: mesh });
      };
      raf = requestAnimationFrame(update);
    } catch (err) {
      console.warn('SpecularButton WebGL fallback enabled:', err);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      if (onPointerMove) window.removeEventListener('pointermove', onPointerMove);
      if (gl && gl.canvas && gl.canvas.parentNode === fx) fx.removeChild(gl.canvas);
      if (gl) gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  const Component = href ? 'a' : 'button';

  return (
    <Component
      ref={btnRef}
      href={href}
      target={target}
      rel={rel}
      type={href ? undefined : type}
      disabled={disabled}
      onClick={onClick}
      className={`specular-btn specular-btn--${variant} specular-btn--${size}${className ? ` ${className}` : ''}`}
      style={{
        borderRadius: `${radius}px`,
        color: textColor || undefined,
        ...style
      }}
    >
      <span ref={fxRef} className="specular-btn__fx" aria-hidden="true" />
      <span className="specular-btn__label">{children}</span>
    </Component>
  );
};

export default SpecularButton;

