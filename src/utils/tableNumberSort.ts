const TOKEN_PATTERN = /(\d+|\D+)/g;

export function compareTableNumbers(a: unknown, b: unknown): number {
  const left = String(a ?? "");
  const right = String(b ?? "");
  if (left === right) return 0;

  const aTokens = left.match(TOKEN_PATTERN) || [];
  const bTokens = right.match(TOKEN_PATTERN) || [];
  const len = Math.max(aTokens.length, bTokens.length);

  for (let i = 0; i < len; i += 1) {
    if (i >= aTokens.length) return -1;
    if (i >= bTokens.length) return 1;

    const aPart = aTokens[i];
    const bPart = bTokens[i];
    const aIsNum = /^\d+$/.test(aPart);
    const bIsNum = /^\d+$/.test(bPart);

    if (aIsNum && bIsNum) {
      const diff = Number(aPart) - Number(bPart);
      if (diff !== 0) return diff;
    } else {
      const cmp = aPart.localeCompare(bPart, undefined, { sensitivity: "base" });
      if (cmp !== 0) return cmp;
    }
  }

  return 0;
}

export function sortTablesByNumber<T extends { tableNumber?: string }>(
  tables: T[]
): T[] {
  if (!Array.isArray(tables)) return [];
  return [...tables].sort((a, b) =>
    compareTableNumbers(a?.tableNumber, b?.tableNumber)
  );
}

function normalizeTablePrefix(prefix: string): string {
  return String(prefix ?? "")
    .trim()
    .replace(/-+$/, "");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getMaxTableNumberSuffix(
  prefix: string,
  existingTables: Array<{ tableNumber?: string }> = []
): number {
  const base = normalizeTablePrefix(prefix);
  if (!base) return 0;

  const pattern = new RegExp(`^${escapeRegExp(base)}-(\\d+)$`, "i");
  let max = 0;

  for (const table of existingTables) {
    const label = table?.tableNumber;
    if (!label) continue;
    const match = String(label).match(pattern);
    if (!match) continue;
    const value = parseInt(match[1], 10);
    if (Number.isFinite(value) && value > max) {
      max = value;
    }
  }

  return max;
}

export function getBulkTableStartIndex(
  prefix: string,
  existingTables: Array<{ tableNumber?: string }> = []
): number {
  return getMaxTableNumberSuffix(prefix, existingTables) + 1;
}

export function getBulkTableNumberRange(
  prefix: string,
  count: number,
  existingTables: Array<{ tableNumber?: string }> = []
): { base: string; start: number; end: number } {
  const base = normalizeTablePrefix(prefix);
  const n = Math.floor(count);
  const start = getBulkTableStartIndex(base, existingTables);
  const end = start + n - 1;
  return { base, start, end };
}
