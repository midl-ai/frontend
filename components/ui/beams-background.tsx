'use client';

import { useEffect, useRef, useCallback, memo } from 'react';

interface Beam {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  opacity: number;
  hue: number;
  delay: number;
}

const BEAM_COUNT = 8;
const MIN_BEAM_WIDTH = 2;
const MAX_BEAM_WIDTH = 6;
const MIN_BEAM_HEIGHT = 100;
const MAX_BEAM_HEIGHT = 400;

/** Animated light beams background - creates depth and movement */
export const BeamsBackground = memo(function BeamsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const createBeam = useCallback((canvasWidth: number, canvasHeight: number): Beam => {
    return {
      x: Math.random() * canvasWidth,
      y: -MAX_BEAM_HEIGHT - Math.random() * canvasHeight,
      width: MIN_BEAM_WIDTH + Math.random() * (MAX_BEAM_WIDTH - MIN_BEAM_WIDTH),
      height: MIN_BEAM_HEIGHT + Math.random() * (MAX_BEAM_HEIGHT - MIN_BEAM_HEIGHT),
      speed: 0.5 + Math.random() * 1.5,
      opacity: 0.1 + Math.random() * 0.15,
      hue: 20 + Math.random() * 20, // Orange hues (20-40)
      delay: Math.random() * 3000,
    };
  }, []);

  const initBeams = useCallback((canvasWidth: number, canvasHeight: number) => {
    beamsRef.current = Array.from({ length: BEAM_COUNT }, () =>
      createBeam(canvasWidth, canvasHeight)
    );
  }, [createBeam]);

  const drawBeam = useCallback((
    ctx: CanvasRenderingContext2D,
    beam: Beam,
    currentTime: number
  ) => {
    // Check if beam should start (delay)
    if (currentTime < beam.delay) return;

    const gradient = ctx.createLinearGradient(
      beam.x,
      beam.y,
      beam.x,
      beam.y + beam.height
    );

    const color = `hsla(${beam.hue}, 90%, 55%, ${beam.opacity})`;
    const colorFade = `hsla(${beam.hue}, 90%, 55%, 0)`;

    gradient.addColorStop(0, colorFade);
    gradient.addColorStop(0.1, color);
    gradient.addColorStop(0.9, color);
    gradient.addColorStop(1, colorFade);

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.fillRect(beam.x, beam.y, beam.width, beam.height);
  }, []);

  // Animation frame callback stored in ref to avoid circular dependency
  const animateRef = useRef<() => void>(() => {});

  // Update the animation function
  useEffect(() => {
    animateRef.current = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const currentTime = Date.now() - startTimeRef.current;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw beams
      beamsRef.current.forEach((beam) => {
        // Move beam down
        beam.y += beam.speed;

        // Reset beam if it goes off screen
        if (beam.y > canvas.height) {
          beam.y = -beam.height;
          beam.x = Math.random() * canvas.width;
          beam.delay = 0; // No delay on reset
        }

        drawBeam(ctx, beam, currentTime);
      });

      animationRef.current = requestAnimationFrame(animateRef.current);
    };
  }, [drawBeam]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      initBeams(rect.width, rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    startTimeRef.current = Date.now();
    animateRef.current();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initBeams]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ filter: 'blur(40px)' }}
      aria-hidden="true"
    />
  );
});

export default BeamsBackground;
