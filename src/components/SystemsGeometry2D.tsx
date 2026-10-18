import React, { useEffect, useRef } from 'react';
import './SystemsGeometry2D.css';

interface SystemsGeometry2DProps {
  isReady?: boolean;
  isReducedMotion?: boolean;
}

interface NodeData {
  id: string;
  baseX: number;
  baseY: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  currentScale: number;
  targetScale: number;
}

const INITIAL_NODES: Record<string, { baseX: number; baseY: number }> = {
  n1: { baseX: 160, baseY: 380 },
  n2: { baseX: 250, baseY: 200 },
  n3: { baseX: 360, baseY: 260 },
  n4: { baseX: 280, baseY: 540 },
  n5: { baseX: 400, baseY: 620 },
  n6: { baseX: 1040, baseY: 380 },
  n7: { baseX: 950, baseY: 200 },
  n8: { baseX: 840, baseY: 260 },
  n9: { baseX: 920, baseY: 540 },
  n10: { baseX: 800, baseY: 620 },
};

export const SystemsGeometry2D: React.FC<SystemsGeometry2DProps> = ({
  isReady = true,
  isReducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rafIdRef = useRef<number | null>(null);

  // SVG element refs for direct 60/120fps DOM manipulation without React re-renders
  const pathLeftRef = useRef<SVGPathElement>(null);
  const pathRightRef = useRef<SVGPathElement>(null);
  const pathLowerLeftRef = useRef<SVGPathElement>(null);
  const pathLowerRightRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<Map<string, SVGGElement>>(new Map());

  // Mutable node state for physics interpolation
  const nodesStateRef = useRef<Record<string, NodeData>>(
    Object.entries(INITIAL_NODES).reduce((acc, [id, pos]) => {
      acc[id] = {
        id,
        baseX: pos.baseX,
        baseY: pos.baseY,
        currentX: pos.baseX,
        currentY: pos.baseY,
        targetX: pos.baseX,
        targetY: pos.baseY,
        currentScale: 1,
        targetScale: 1,
      };
      return acc;
    }, {} as Record<string, NodeData>)
  );

  useEffect(() => {
    if (isReducedMotion) return;

    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;
    let pointerSvgX = -9999;
    let pointerSvgY = -9999;
    let isPointerInside = false;

    const animateLoop = () => {
      // 1. Multi-plane parallax interpolation (smooth spring lerp)
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.075;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.075;

      container.style.setProperty('--px-x', `${currentParallaxX.toFixed(2)}px`);
      container.style.setProperty('--px-y', `${currentParallaxY.toFixed(2)}px`);

      // 2. Proximity-responsive nodes & elastic vector interpolation
      const nodes = nodesStateRef.current;
      const PROXIMITY_RADIUS = 150;
      const MAX_DISPLACEMENT = 10;
      let hasActiveNodeMotion = false;

      for (const key of Object.keys(nodes)) {
        const node = nodes[key];

        if (isPointerInside) {
          const dx = pointerSvgX - node.baseX;
          const dy = pointerSvgY - node.baseY;
          const dist = Math.hypot(dx, dy);

          if (dist < PROXIMITY_RADIUS && dist > 1) {
            // Smooth bell-shaped falloff
            const factor = Math.cos((dist / PROXIMITY_RADIUS) * (Math.PI / 2));
            // Subtle magnetic pull toward cursor
            node.targetX = node.baseX + (dx / dist) * MAX_DISPLACEMENT * factor;
            node.targetY = node.baseY + (dy / dist) * MAX_DISPLACEMENT * factor;
            node.targetScale = 1 + 0.35 * factor;
          } else {
            node.targetX = node.baseX;
            node.targetY = node.baseY;
            node.targetScale = 1;
          }
        } else {
          node.targetX = node.baseX;
          node.targetY = node.baseY;
          node.targetScale = 1;
        }

        // Lerp toward target
        const diffX = node.targetX - node.currentX;
        const diffY = node.targetY - node.currentY;
        const diffScale = node.targetScale - node.currentScale;

        node.currentX += diffX * 0.1;
        node.currentY += diffY * 0.1;
        node.currentScale += diffScale * 0.1;

        if (Math.abs(diffX) > 0.02 || Math.abs(diffY) > 0.02 || Math.abs(diffScale) > 0.005) {
          hasActiveNodeMotion = true;
        }

        // Apply transform to node group
        const nodeEl = nodeRefs.current.get(key);
        if (nodeEl) {
          const shiftX = (node.currentX - node.baseX).toFixed(2);
          const shiftY = (node.currentY - node.baseY).toFixed(2);
          const scale = node.currentScale.toFixed(2);
          nodeEl.setAttribute(
            'transform',
            `translate(${shiftX}, ${shiftY}) scale(${scale})`
          );
        }
      }

      // 3. Elastic connected vectors: update path d coordinates
      const n = nodes;
      if (pathLeftRef.current) {
        pathLeftRef.current.setAttribute(
          'd',
          `M ${n.n1.currentX.toFixed(1)} ${n.n1.currentY.toFixed(1)} L ${n.n2.currentX.toFixed(1)} ${n.n2.currentY.toFixed(1)} L ${n.n3.currentX.toFixed(1)} ${n.n3.currentY.toFixed(1)}`
        );
      }
      if (pathRightRef.current) {
        pathRightRef.current.setAttribute(
          'd',
          `M ${n.n6.currentX.toFixed(1)} ${n.n6.currentY.toFixed(1)} L ${n.n7.currentX.toFixed(1)} ${n.n7.currentY.toFixed(1)} L ${n.n8.currentX.toFixed(1)} ${n.n8.currentY.toFixed(1)}`
        );
      }
      if (pathLowerLeftRef.current) {
        pathLowerLeftRef.current.setAttribute(
          'd',
          `M ${n.n4.currentX.toFixed(1)} ${n.n4.currentY.toFixed(1)} L ${n.n5.currentX.toFixed(1)} ${n.n5.currentY.toFixed(1)} L 520 580`
        );
      }
      if (pathLowerRightRef.current) {
        pathLowerRightRef.current.setAttribute(
          'd',
          `M ${n.n9.currentX.toFixed(1)} ${n.n9.currentY.toFixed(1)} L ${n.n10.currentX.toFixed(1)} ${n.n10.currentY.toFixed(1)} L 680 580`
        );
      }

      const parallaxActive =
        Math.abs(targetParallaxX - currentParallaxX) > 0.05 ||
        Math.abs(targetParallaxY - currentParallaxY) > 0.05;

      if (isPointerInside || parallaxActive || hasActiveNodeMotion) {
        rafIdRef.current = requestAnimationFrame(animateLoop);
      } else {
        rafIdRef.current = null;
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth) * 2 - 1;
      const normY = (e.clientY / innerHeight) * 2 - 1;
      // Controlled parallax max offset: +/- 11px
      targetParallaxX = normX * 11;
      targetParallaxY = normY * 11;

      // Project pointer into SVG coordinate space (0-1200 x 0-800)
      const rect = svg.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        pointerSvgX = ((e.clientX - rect.left) / rect.width) * 1200;
        pointerSvgY = ((e.clientY - rect.top) / rect.height) * 800;
        isPointerInside = true;
      }

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(animateLoop);
      }
    };

    const handlePointerLeave = () => {
      targetParallaxX = 0;
      targetParallaxY = 0;
      isPointerInside = false;
      pointerSvgX = -9999;
      pointerSvgY = -9999;

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(animateLoop);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isReducedMotion]);

  const animationClass = isReducedMotion
    ? 'geometry-static'
    : isReady
    ? 'geometry-animate-in'
    : 'geometry-idle';

  return (
    <div
      ref={containerRef}
      className={`systems-geometry-container ${animationClass}`}
      aria-hidden="true"
    >
      {/* 1. Soft atmospheric light gradient centered behind empty focal zone */}
      <div className="geometry-ambient-light" />

      {/* 2. Precision SVG Engineering Constellation */}
      <svg
        ref={svgRef}
        className="geometry-svg"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle line gradient fading toward outer edges */}
          <linearGradient id="geom-line-h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0" />
            <stop offset="25%" stopColor="var(--color-accent-primary)" stopOpacity="0.25" />
            <stop offset="50%" stopColor="var(--color-accent-secondary)" stopOpacity="0.35" />
            <stop offset="75%" stopColor="var(--color-accent-primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="geom-line-v" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0" />
            <stop offset="30%" stopColor="var(--color-accent-primary)" stopOpacity="0.2" />
            <stop offset="70%" stopColor="var(--color-accent-secondary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="geom-node-halo-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Background Precision Grid Layer (Depth Plane: 0.35x) */}
        <g className="geom-grid-layer" opacity="0.45">
          {/* Horizontal guidelines */}
          <line x1="100" y1="200" x2="1100" y2="200" stroke="var(--color-border-subtle)" strokeWidth="1" strokeDasharray="4 8" />
          <line x1="100" y1="600" x2="1100" y2="600" stroke="var(--color-border-subtle)" strokeWidth="1" strokeDasharray="4 8" />

          {/* Vertical guidelines */}
          <line x1="250" y1="80" x2="250" y2="720" stroke="var(--color-border-subtle)" strokeWidth="1" strokeDasharray="4 8" />
          <line x1="950" y1="80" x2="950" y2="720" stroke="var(--color-border-subtle)" strokeWidth="1" strokeDasharray="4 8" />
        </g>

        {/* Central Geometric Orbital Arcs Layer (Depth Plane: 0.65x) */}
        <g className="geom-arcs-layer">
          {/* Major orbital ellipse: smooth continuous optical contour without dotted dasharray */}
          <ellipse
            cx="600"
            cy="400"
            rx="460"
            ry="260"
            stroke="url(#geom-line-h)"
            strokeWidth="0.8"
            className="geom-draw-path path-arc-major"
          />

          {/* Inner tilted orbital arc: smooth subtle contour */}
          <ellipse
            cx="600"
            cy="400"
            rx="340"
            ry="180"
            stroke="var(--color-border-subtle)"
            strokeWidth="0.6"
            strokeOpacity="0.3"
            className="geom-draw-path path-arc-inner"
          />

          {/* Precision outer boundary arc: smooth faint hairline guide */}
          <ellipse
            cx="600"
            cy="400"
            rx="540"
            ry="310"
            stroke="var(--color-border-subtle)"
            strokeWidth="0.5"
            strokeOpacity="0.18"
            className="geom-draw-path path-arc-outer"
          />
        </g>

        {/* Interconnected System Vectors (Elastic Connected Paths: 1.0x) */}
        <g className="geom-vectors-layer">
          {/* Left flank system vector */}
          <path
            ref={pathLeftRef}
            d="M 160 380 L 250 200 L 360 260"
            stroke="var(--color-accent-primary)"
            strokeWidth="1.2"
            strokeOpacity="0.45"
            className="geom-draw-path path-vec-left"
          />
          {/* Right flank system vector */}
          <path
            ref={pathRightRef}
            d="M 1040 380 L 950 200 L 840 260"
            stroke="var(--color-accent-primary)"
            strokeWidth="1.2"
            strokeOpacity="0.45"
            className="geom-draw-path path-vec-right"
          />

          {/* Lower interconnected telemetry arcs */}
          <path
            ref={pathLowerLeftRef}
            d="M 280 540 L 400 620 L 520 580"
            stroke="var(--color-accent-secondary)"
            strokeWidth="1"
            strokeOpacity="0.35"
            className="geom-draw-path path-vec-lower-left"
          />
          <path
            ref={pathLowerRightRef}
            d="M 920 540 L 800 620 L 680 580"
            stroke="var(--color-accent-secondary)"
            strokeWidth="1"
            strokeOpacity="0.35"
            className="geom-draw-path path-vec-lower-right"
          />
        </g>

        {/* Structural Interactive Nodes (Proximity Aware: 1.0x) */}
        <g className="geom-nodes-layer">
          {/* Node 1: Left circle */}
          <g
            ref={(el) => {
              if (el) nodeRefs.current.set('n1', el);
              else nodeRefs.current.delete('n1');
            }}
            style={{ transformOrigin: '160px 380px' }}
          >
            <circle cx="160" cy="380" r="12" fill="url(#geom-node-halo-glow)" className="geom-node-halo" />
            <circle cx="160" cy="380" r="3" fill="var(--color-accent-primary)" className="geom-node node-1" />
          </g>

          {/* Node 2: Left top diamond */}
          <g
            ref={(el) => {
              if (el) nodeRefs.current.set('n2', el);
              else nodeRefs.current.delete('n2');
            }}
            style={{ transformOrigin: '250px 200px' }}
          >
            <circle cx="250" cy="200" r="12" fill="url(#geom-node-halo-glow)" className="geom-node-halo" />
            <polygon points="250,196 254,200 250,204 246,200" fill="var(--color-accent-primary)" className="geom-node node-2" />
          </g>

          {/* Node 3: Left inner circle */}
          <g
            ref={(el) => {
              if (el) nodeRefs.current.set('n3', el);
              else nodeRefs.current.delete('n3');
            }}
            style={{ transformOrigin: '360px 260px' }}
          >
            <circle cx="360" cy="260" r="10" fill="url(#geom-node-halo-glow)" className="geom-node-halo" />
            <circle cx="360" cy="260" r="2.5" fill="var(--color-text-secondary)" className="geom-node node-3" />
          </g>

          {/* Node 4: Left lower circle */}
          <g
            ref={(el) => {
              if (el) nodeRefs.current.set('n4', el);
              else nodeRefs.current.delete('n4');
            }}
            style={{ transformOrigin: '280px 540px' }}
          >
            <circle cx="280" cy="540" r="10" fill="url(#geom-node-halo-glow)" className="geom-node-halo" />
            <circle cx="280" cy="540" r="2.5" fill="var(--color-accent-secondary)" className="geom-node node-4" />
          </g>

          {/* Node 5: Left bottom diamond */}
          <g
            ref={(el) => {
              if (el) nodeRefs.current.set('n5', el);
              else nodeRefs.current.delete('n5');
            }}
            style={{ transformOrigin: '400px 620px' }}
          >
            <circle cx="400" cy="620" r="12" fill="url(#geom-node-halo-glow)" className="geom-node-halo" />
            <polygon points="400,616 404,620 400,624 396,620" fill="var(--color-accent-primary)" className="geom-node node-5" />
          </g>

          {/* Node 6: Right circle */}
          <g
            ref={(el) => {
              if (el) nodeRefs.current.set('n6', el);
              else nodeRefs.current.delete('n6');
            }}
            style={{ transformOrigin: '1040px 380px' }}
          >
            <circle cx="1040" cy="380" r="12" fill="url(#geom-node-halo-glow)" className="geom-node-halo" />
            <circle cx="1040" cy="380" r="3" fill="var(--color-accent-primary)" className="geom-node node-6" />
          </g>

          {/* Node 7: Right top diamond */}
          <g
            ref={(el) => {
              if (el) nodeRefs.current.set('n7', el);
              else nodeRefs.current.delete('n7');
            }}
            style={{ transformOrigin: '950px 200px' }}
          >
            <circle cx="950" cy="200" r="12" fill="url(#geom-node-halo-glow)" className="geom-node-halo" />
            <polygon points="950,196 954,200 950,204 946,200" fill="var(--color-accent-primary)" className="geom-node node-7" />
          </g>

          {/* Node 8: Right inner circle */}
          <g
            ref={(el) => {
              if (el) nodeRefs.current.set('n8', el);
              else nodeRefs.current.delete('n8');
            }}
            style={{ transformOrigin: '840px 260px' }}
          >
            <circle cx="840" cy="260" r="10" fill="url(#geom-node-halo-glow)" className="geom-node-halo" />
            <circle cx="840" cy="260" r="2.5" fill="var(--color-text-secondary)" className="geom-node node-8" />
          </g>

          {/* Node 9: Right lower circle */}
          <g
            ref={(el) => {
              if (el) nodeRefs.current.set('n9', el);
              else nodeRefs.current.delete('n9');
            }}
            style={{ transformOrigin: '920px 540px' }}
          >
            <circle cx="920" cy="540" r="10" fill="url(#geom-node-halo-glow)" className="geom-node-halo" />
            <circle cx="920" cy="540" r="2.5" fill="var(--color-accent-secondary)" className="geom-node node-9" />
          </g>

          {/* Node 10: Right bottom diamond */}
          <g
            ref={(el) => {
              if (el) nodeRefs.current.set('n10', el);
              else nodeRefs.current.delete('n10');
            }}
            style={{ transformOrigin: '800px 620px' }}
          >
            <circle cx="800" cy="620" r="12" fill="url(#geom-node-halo-glow)" className="geom-node-halo" />
            <polygon points="800,616 804,620 800,624 796,620" fill="var(--color-accent-primary)" className="geom-node node-10" />
          </g>

          {/* Top subtle vertical axis node */}
          <line x1="600" y1="70" x2="600" y2="120" stroke="var(--color-accent-primary)" strokeWidth="1" strokeOpacity="0.5" />
          <circle cx="600" cy="95" r="2" fill="var(--color-accent-primary)" />
        </g>

        {/* Technical Coordinate Reticles at Periphery (Depth Plane: 0.35x) */}
        <g className="geom-reticles-layer" opacity="0.35">
          {/* Top-left crosshair */}
          <path d="M 120 140 H 130 M 125 135 V 145" stroke="var(--color-text-muted)" strokeWidth="1" />
          {/* Top-right crosshair */}
          <path d="M 1070 140 H 1080 M 1075 135 V 145" stroke="var(--color-text-muted)" strokeWidth="1" />
          {/* Bottom-left crosshair */}
          <path d="M 120 660 H 130 M 125 655 V 665" stroke="var(--color-text-muted)" strokeWidth="1" />
          {/* Bottom-right crosshair */}
          <path d="M 1070 660 H 1080 M 1075 655 V 665" stroke="var(--color-text-muted)" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
};
