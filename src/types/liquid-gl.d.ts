declare module 'liquid-gl' {
  export interface LiquidGLOptions {
    target: string;
    snapshot?: string;
    resolution?: number;
    engine?: 'auto' | 'webgpu' | 'webgl2' | 'webgl';
    zIndex?: number;
    content?: string | boolean;
    refraction?: number;
    aberration?: number;
    bevelDepth?: number;
    bevelWidth?: number;
    frost?: number;
    shadow?: boolean;
    specular?: boolean;
    reveal?: 'none' | 'fade';
    tilt?: boolean;
    tiltFactor?: number;
    tiltEase?: number;
    draggable?: boolean;
    interaction?: 'none' | 'fluid';
    interactionStrength?: number;
    interactionRadius?: number;
    interactionViscosity?: number;
    magnify?: number;
    tint?: string | null;
    helper?: boolean;
    on?: {
      init?: (instance: LiquidGLLens) => void;
      dragstart?: (instance: LiquidGLLens, info: { clientX: number; clientY: number }) => void;
      drag?: (instance: LiquidGLLens, info: { clientX: number; clientY: number; x: number; y: number }) => void;
      dragend?: (instance: LiquidGLLens, info: { clientX?: number; clientY?: number; x: number; y: number }) => void;
    };
  }

  export interface LiquidGLRenderer {
    canvas: HTMLCanvasElement;
    captureSnapshot: () => Promise<boolean>;
    render: () => void;
    _destroyed?: boolean;
    _capturing?: boolean;
  }

  export interface LiquidGLLens {
    el: HTMLElement;
    options: LiquidGLOptions;
    renderer?: LiquidGLRenderer;
    destroy: () => void;
    setTint: (tint: string | null) => void;
    setDraggable: (enabled: boolean) => void;
    setTilt?: (enabled: boolean) => void;
    updateMetrics: () => void;
    clearDrag?: () => void;
  }

  export interface LiquidGLSyncOptions {
    gsap?: unknown;
    ScrollTrigger?: unknown;
    lenis?: unknown;
    locomotiveScroll?: unknown;
  }

  export interface LiquidGLFunction {
    (options?: LiquidGLOptions): LiquidGLLens | LiquidGLLens[] | undefined;
    registerDynamic?: (elements: string | HTMLElement | HTMLElement[] | NodeListOf<Element>) => void;
    syncWith?: (options: LiquidGLSyncOptions) => unknown;
  }

  const liquidGL: LiquidGLFunction;
  export default liquidGL;
}
