export function formatWaitTime(seconds: number | undefined | null) {
  if (!seconds || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getWaitTimeColor(seconds: number) {
  if (seconds < 300) return "#22c55e";
  if (seconds < 600) return "#FFB020";
  return "#ef4444";
}
