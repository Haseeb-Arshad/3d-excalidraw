/**
 * Shared constants: versioning, feature flags, and numerical tolerances used across the app.
 */

export const VERSION = {
  app: "0.1.0",
  protocol: 1
} as const;

export const FEATURE_FLAGS = {
  realtime: true,
  physics: false,
  mlAssist: false,
  debugHUD: true
} as const;

/**
 * Numerical tolerances used by the 2D ink pipeline and geometric ops.
 */
export const TOLERANCES = {
  simplifyEpsilonPx: 1.5,
  fitResidualThreshold: 0.015,
  angleSnapThresholdDeg: 7.5,
  holdToSnapMs: 300,
  workerTimeoutMs: 1500
} as const;

/**
 * Angles (in degrees) that 2D strokes may snap to when snapping is enabled.
 */
export const SNAP_ANGLES_DEG = [0, 45, 90, 135, 180, 225, 270, 315] as const;

export type FeatureFlags = typeof FEATURE_FLAGS;
