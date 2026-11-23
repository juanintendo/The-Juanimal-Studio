import type { RefObject } from "react";

export interface TelemetryRefs {
  txRef: RefObject<HTMLElement | null>;
  tyRef: RefObject<HTMLElement | null>;
  cookRef: RefObject<HTMLElement | null>;
  fpsRef: RefObject<HTMLElement | null>;
  labFpsRef: RefObject<HTMLElement | null>;
}

export function writeTelemetry(
  refs: TelemetryRefs,
  tx: number,
  ty: number,
  cookMs: number,
  fps: number
) {
  if (refs.txRef.current) refs.txRef.current.textContent = tx.toFixed(3);
  if (refs.tyRef.current) refs.tyRef.current.textContent = ty.toFixed(3);
  if (refs.cookRef.current) refs.cookRef.current.textContent = cookMs.toFixed(1);
  if (refs.fpsRef.current) refs.fpsRef.current.textContent = String(fps);
  if (refs.labFpsRef.current) refs.labFpsRef.current.textContent = `${fps} fps`;
}
