export function matchesAttributeCategory(name: string, categories: string[]) {
  return categories.some(prefix => name.startsWith(prefix));
}
