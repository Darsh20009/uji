// Visitor tracking — in-memory, no persistence needed
const visitorMap = new Map<string, number>(); // ip -> lastSeen ms
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes = "online"

// Clean up stale entries every minute
setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [ip, time] of visitorMap) {
    if (time < cutoff) visitorMap.delete(ip);
  }
}, 60_000).unref();

export const trackVisit = (ip: string) => visitorMap.set(ip, Date.now());

export const getActiveVisitors = () => {
  const cutoff = Date.now() - WINDOW_MS;
  let count = 0;
  for (const time of visitorMap.values()) if (time > cutoff) count++;
  return count;
};
