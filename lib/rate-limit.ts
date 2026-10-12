/**
 * Best-effort, per-instance sliding-window rate limiter. Serverless instances don't share memory,
 * so this blunts bursts from one client rather than guaranteeing a global limit.
 */
export function createRateLimiter({ windowMs, max }: { windowMs: number; max: number }) {
  const hits = new Map<string, number[]>();
  return function limited(key: string) {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    const blocked = recent.length >= max;
    if (!blocked) recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) hits.clear(); // keep memory bounded
    return blocked;
  };
}

/** Client IP from Vercel / proxy headers. */
export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}
