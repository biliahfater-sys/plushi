"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ShaderAnimationProps {
  className?: string;
}

export function ShaderAnimation({ className = "h-full w-full" }: ShaderAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    uniforms: { time: { value: number }; resolution: { value: THREE.Vector2 } };
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    // Warm pastel line-field: cream base glowing into pink, lavender and mint.
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        float lineWidth = 0.0022;

        float field = 0.0;
        for (int i = 0; i < 5; i++) {
          field += lineWidth * float(i*i) /
            abs(fract(t + float(i)*0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
        }
        field = clamp(field, 0.0, 1.0);

        vec3 cream    = vec3(1.000, 0.973, 0.953);
        vec3 pink     = vec3(0.969, 0.722, 0.800);
        vec3 lavender = vec3(0.773, 0.702, 0.941);
        vec3 mint     = vec3(0.647, 0.882, 0.773);

        vec3 col = mix(cream, pink, smoothstep(0.0, 0.4, field));
        col = mix(col, lavender, smoothstep(0.35, 0.7, field));
        col = mix(col, mint, smoothstep(0.7, 1.0, field));

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;
    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    };
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };
    onResize();
    window.addEventListener("resize", onResize, false);

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
      if (sceneRef.current) sceneRef.current.animationId = animationId;
    };
    sceneRef.current = { renderer, uniforms, animationId: 0 };
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, []);

  return <div ref={containerRef} className={className} style={{ overflow: "hidden" }} />;
}
