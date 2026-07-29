import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Tells you exactly which commit is live.
 *
 * Static assets and pages get cached aggressively, so "the site still shows
 * the old thing" is ambiguous: stale deploy, or stale cache? Hit this route
 * and compare `commit` against the latest SHA on GitHub. If it matches, the
 * deploy is current and anything stale is a cache; if it doesn't, the deploy
 * never landed.
 */
export async function GET() {
  return NextResponse.json({
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
    message: process.env.VERCEL_GIT_COMMIT_MESSAGE ?? null,
    branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
    builtAt: new Date().toISOString(),
  });
}
