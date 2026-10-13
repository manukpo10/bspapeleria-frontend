import { useId, useLayoutEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

// The same five-point star as the bg-stars pattern in index.css
const STAR = 'M0-10 2.9-3.9 9.5-3.1 4.6 1.5 5.9 8.1 0 4.8-5.9 8.1-4.6 1.5-9.5-3.1-2.9-3.9Z';

// Outline of the wake, traced on the logo's own 1000 x 674 canvas so the proportions match
const TRAIL = 'M0 272C240 165 520 72 835 26L862 56C640 105 420 235 250 345 140 420 50 540 0 674Z';

// The line the plane flies along: up the middle of the wake, from off the canvas to where the plane rests
const FLIGHT = 'M-60 520C120 330 540 66 836 30';

// Where the plane rests once it has landed: the end of FLIGHT and the direction it arrives in
const PLANE_AT_REST = 'translate(836 30) rotate(-6.9)';

// The reveal is a 1200-wide rectangle that slides right; its last tenth (120 units) is a soft edge.
// At rest its right edge sits past the canvas, so the whole wake is opaque
const REVEAL_WIDTH = 1200;
const REVEAL_AT_REST = 1120 - REVEAL_WIDTH;

const smoothstep = (from: number, to: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

interface PlaneTrailProps {
  className?: string;
  /**
   * Plays the fly-in once: `true` as soon as the component mounts, `'in-view'` when the drawing scrolls into view.
   * Ignored when the visitor prefers reduced motion
   */
  animated?: boolean | 'in-view';
}

/*
 * The brand motif: the wake a paper plane leaves, wide where it started (bottom left) and thinning out towards the
 * plane (top right), in the ribbon colours and sprinkled with stars.
 *
 * The markup always describes the finished picture. The fly-in only moves two things from script and puts them
 * back when it ends: the plane along FLIGHT, and the rectangle that uncovers the wake behind it.
 */
export function PlaneTrail({ className, animated = false }: PlaneTrailProps) {
  // useId can contain characters that are awkward inside url(#...), so keep only the safe ones
  const id = `trail${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const reduceMotion = useReducedMotion();
  const flightRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const revealRef = useRef<SVGRectElement>(null);

  // Layout effect: the starting pose has to be in place before the first paint, or the finished picture flashes
  useLayoutEffect(() => {
    const flight = flightRef.current;
    const plane = planeRef.current;
    const reveal = revealRef.current;
    if (!animated || reduceMotion || !flight || !plane || !reveal) return;

    const length = flight.getTotalLength();

    const pose = (progress: number) => {
      const distance = progress * length;
      const at = flight.getPointAtLength(distance);
      const behind = flight.getPointAtLength(Math.max(0, distance - 2));
      const ahead = flight.getPointAtLength(Math.min(length, distance + 2));
      const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
      plane.setAttribute('transform', `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)}) rotate(${angle.toFixed(1)})`);

      // The wake appears right behind the plane, then runs on past the tip over the last stretch of the flight
      const edge = at.x + (1120 - at.x) * smoothstep(0.82, 1, progress);
      reveal.setAttribute('x', (edge - REVEAL_WIDTH).toFixed(1));
    };

    const rest = () => {
      plane.setAttribute('transform', PLANE_AT_REST);
      reveal.setAttribute('x', String(REVEAL_AT_REST));
    };

    pose(0);
    let controls: ReturnType<typeof animate> | undefined;
    const fly = (delay: number) => {
      controls = animate(0, 1, { duration: 1.7, delay, ease: [0.3, 0.05, 0.2, 1], onUpdate: pose, onComplete: rest });
    };

    let observer: IntersectionObserver | undefined;
    if (animated === 'in-view' && 'IntersectionObserver' in window) {
      // A low threshold: the drawing is often partly cut by its container, so most of it may never be visible
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          fly(0.1);
        },
        { threshold: 0.15 },
      );
      observer.observe(flight.ownerSVGElement ?? flight);
    } else {
      fly(0.35);
    }

    return () => {
      observer?.disconnect();
      controls?.stop();
      rest();
    };
  }, [animated, reduceMotion]);

  return (
    <svg viewBox="0 0 1000 674" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`${id}-ribbon`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#e9c5fb" />
          <stop offset="0.38" stopColor="#d0b8fb" />
          <stop offset="0.72" stopColor="#c1cdfb" />
          <stop offset="1" stopColor="#d8eafc" />
        </linearGradient>
        <pattern id={`${id}-stars`} width="220" height="220" patternUnits="userSpaceOnUse">
          <g fill="white" stroke="white" strokeWidth="2.5" strokeLinejoin="round">
            <path d={STAR} transform="translate(28 34) rotate(12)" />
            <path d={STAR} transform="translate(118 22) rotate(-8) scale(.7)" />
            <path d={STAR} transform="translate(186 70) rotate(20) scale(.9)" />
            <path d={STAR} transform="translate(76 96) rotate(-14) scale(.8)" />
            <path d={STAR} transform="translate(150 138) rotate(6)" />
            <path d={STAR} transform="translate(34 160) rotate(-20) scale(.75)" />
            <path d={STAR} transform="translate(100 192) rotate(14) scale(.65)" />
            <path d={STAR} transform="translate(200 196) rotate(-6) scale(.8)" />
          </g>
        </pattern>

        {/* In the logo the canvas edge cuts the far end of the wake; here it fades out instead */}
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.24" stopColor="white" />
        </linearGradient>
        <mask id={`${id}-far-end`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="674">
          <rect width="1000" height="674" fill={`url(#${id}-fade)`} />
        </mask>

        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.9" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-reveal`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="674">
          <rect ref={revealRef} x={REVEAL_AT_REST} width={REVEAL_WIDTH} height="674" fill={`url(#${id}-edge)`} />
        </mask>
      </defs>

      <path ref={flightRef} d={FLIGHT} />

      <g mask={`url(#${id}-far-end)`}>
        <g mask={`url(#${id}-reveal)`}>
          <path d={TRAIL} fill={`url(#${id}-ribbon)`} />
          <path d={TRAIL} fill={`url(#${id}-stars)`} opacity="0.7" />
        </g>
      </g>

      {/* The paper plane, in the logo's violet. Drawn pointing right with its tail at the origin */}
      <g ref={planeRef} transform={PLANE_AT_REST}>
        <path d="M150 0-41-31 0 0Z" fill="#b79cf9" />
        <path d="M150 0 0 0 32 32Z" fill="#a584f3" />
        <path d="M0 0-10 25 15 16Z" fill="#8f6be8" />
      </g>
    </svg>
  );
}
