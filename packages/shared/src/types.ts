/**
 * Core shared types used across web, server, workers, and engine.
 * Types only; runtime validation lives in schemas.ts via Zod.
 */

export type ISODateString = string;

/**
 * A single sampled pointer point.
 */
export interface StrokePoint {
  x: number;
  y: number;
  t: number; // epoch ms
  pressure?: number; // 0..1
  tiltX?: number; // degrees
  tiltY?: number; // degrees
}

/**
 * A raw ink stroke as captured by the 2D canvas.
 */
export interface Stroke {
  id: string;
  userId?: string;
  color?: string;
  size?: number; // px
  tool?: "pen" | "eraser";
  points: StrokePoint[];
  createdAt?: ISODateString;
}

/**
 * A 2D vectorized representation derived from a Stroke.
 */
export type VectorShape =
  | {
      kind: "line";
      id: string;
      strokeId: string;
      a: { x: number; y: number };
      b: { x: number; y: number };
      angleDeg?: number; // snapped angle if applied
    }
  | {
      kind: "ellipse"; // includes circle when rx == ry
      id: string;
      strokeId: string;
      cx: number;
      cy: number;
      rx: number;
      ry: number;
      rotationDeg?: number;
    }
  | {
      kind: "rect";
      id: string;
      strokeId: string;
      x: number;
      y: number;
      width: number;
      height: number;
      rotationDeg?: number;
      cornerRadius?: number;
    }
  | {
      kind: "polygon";
      id: string;
      strokeId: string;
      points: { x: number; y: number }[];
      closed: true;
    }
  | {
      kind: "polyline"; // fallback when no primitive fit
      id: string;
      strokeId: string;
      points: { x: number; y: number }[];
      closed: false;
    };

/**
 * High-level user intent node produced from 2D vectors or direct UI actions,
 * used to drive 3D scene generation (e.g., terrain, objects, annotations).
 */
export interface IntentNodeBase {
  id: string;
  type: string; // domain-specific identifier
  createdBy?: string;
  createdAt?: ISODateString;
  meta?: Record<string, unknown>;
}

export type IntentNode =
  | (IntentNodeBase & {
      type: "terrain.region";
      outline: { x: number; y: number }[]; // 2D outline projected to world later
    })
  | (IntentNodeBase & {
      type: "object.place";
      position: { x: number; y: number; z?: number };
      kind: string; // e.g., "tree", "rock"
    })
  | (IntentNodeBase & {
      type: "path";
      points: { x: number; y: number }[];
    });

/**
 * Minimal scene entity representation for the engine.
 */
export interface Entity {
  id: string;
  components: Record<string, Record<string, unknown>>; // ecs-like component bag
}

/**
 * Idempotent scene operations used to mutate engine state. These must be
 * conflict-resilient and replayable.
 */
export type SceneOp =
  | {
      op: "entity.create";
      id: string;
      components?: Record<string, Record<string, unknown>>;
    }
  | {
      op: "entity.delete";
      id: string;
    }
  | {
      op: "entity.transform";
      id: string;
      transform: {
        position?: { x: number; y: number; z: number };
        rotation?: { x: number; y: number; z: number };
        scale?: { x: number; y: number; z: number };
      };
    }
  | {
      op: "terrain.create";
      id: string;
      source: "heightfield" | "mesh";
      dataRef?: string; // reference to blob/storage
    }
  | {
    op: "terrain.modify";
    id: string;
    deltaRef: string; // reference to mutation blob
  };
