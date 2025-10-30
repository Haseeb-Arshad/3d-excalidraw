import { z } from "zod";

export const StrokePointSchema = z.object({
  x: z.number(),
  y: z.number(),
  t: z.number().int(),
  pressure: z.number().min(0).max(1).optional(),
  tiltX: z.number().optional(),
  tiltY: z.number().optional()
});

export const StrokeSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  color: z.string().optional(),
  size: z.number().positive().optional(),
  tool: z.enum(["pen", "eraser"]).optional(),
  points: z.array(StrokePointSchema).min(2),
  createdAt: z.string().optional()
});

const Vec2 = z.object({ x: z.number(), y: z.number() });

export const VectorLineSchema = z.object({
  kind: z.literal("line"),
  id: z.string(),
  strokeId: z.string(),
  a: Vec2,
  b: Vec2,
  angleDeg: z.number().optional()
});

export const VectorEllipseSchema = z.object({
  kind: z.literal("ellipse"),
  id: z.string(),
  strokeId: z.string(),
  cx: z.number(),
  cy: z.number(),
  rx: z.number().positive(),
  ry: z.number().positive(),
  rotationDeg: z.number().optional()
});

export const VectorRectSchema = z.object({
  kind: z.literal("rect"),
  id: z.string(),
  strokeId: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  rotationDeg: z.number().optional(),
  cornerRadius: z.number().min(0).optional()
});

export const VectorPolygonSchema = z.object({
  kind: z.literal("polygon"),
  id: z.string(),
  strokeId: z.string(),
  points: z.array(Vec2).min(3),
  closed: z.literal(true)
});

export const VectorPolylineSchema = z.object({
  kind: z.literal("polyline"),
  id: z.string(),
  strokeId: z.string(),
  points: z.array(Vec2).min(2),
  closed: z.literal(false)
});

export const VectorShapeSchema = z.discriminatedUnion("kind", [
  VectorLineSchema,
  VectorEllipseSchema,
  VectorRectSchema,
  VectorPolygonSchema,
  VectorPolylineSchema
]);

export const IntentNodeSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("terrain.region"),
    createdBy: z.string().optional(),
    createdAt: z.string().optional(),
    meta: z.record(z.unknown()).optional(),
    outline: z.array(Vec2).min(3)
  }),
  z.object({
    id: z.string(),
    type: z.literal("object.place"),
    createdBy: z.string().optional(),
    createdAt: z.string().optional(),
    meta: z.record(z.unknown()).optional(),
    position: z.object({ x: z.number(), y: z.number(), z: z.number().optional() }),
    kind: z.string()
  }),
  z.object({
    id: z.string(),
    type: z.literal("path"),
    createdBy: z.string().optional(),
    createdAt: z.string().optional(),
    meta: z.record(z.unknown()).optional(),
    points: z.array(Vec2).min(2)
  })
]);

export const SceneOpSchema = z.discriminatedUnion("op", [
  z.object({
    op: z.literal("entity.create"),
    id: z.string(),
    components: z.record(z.record(z.unknown())).optional()
  }),
  z.object({
    op: z.literal("entity.delete"),
    id: z.string()
  }),
  z.object({
    op: z.literal("entity.transform"),
    id: z.string(),
    transform: z.object({
      position: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional(),
      rotation: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional(),
      scale: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional()
    })
  }),
  z.object({
    op: z.literal("terrain.create"),
    id: z.string(),
    source: z.enum(["heightfield", "mesh"]),
    dataRef: z.string().optional()
  }),
  z.object({
    op: z.literal("terrain.modify"),
    id: z.string(),
    deltaRef: z.string()
  })
]);

export type Stroke = z.infer<typeof StrokeSchema>;
export type VectorShape = z.infer<typeof VectorShapeSchema>;
export type IntentNode = z.infer<typeof IntentNodeSchema>;
export type SceneOp = z.infer<typeof SceneOpSchema>;
