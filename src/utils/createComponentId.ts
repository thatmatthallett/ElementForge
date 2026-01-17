const usedIds = new Set<string>();

export function createComponentId(prefix: string): string {
  let id: string;

  do {
    const n = Math.floor(1000 + Math.random() * 9000);
    id = `${prefix}-${n}`;
  } while (usedIds.has(id));

  usedIds.add(id);
  return id;
}
