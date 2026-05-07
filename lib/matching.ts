import type { Item } from "./types";

function words(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2);
}

export function buildTags(input: {
  title: string;
  category: string;
  color: string;
  location: string;
  description: string;
}) {
  return Array.from(
    new Set([
      ...words(input.title),
      ...words(input.category),
      ...words(input.color),
      ...words(input.location),
      ...words(input.description)
    ])
  ).slice(0, 12);
}

export function scoreMatch(a: Item, b: Item) {
  let score = 0;
  if (a.status === b.status) return 0;
  if (a.category.toLowerCase() === b.category.toLowerCase()) score += 35;
  if (a.color.toLowerCase() === b.color.toLowerCase()) score += 20;
  if (a.location.toLowerCase().includes(b.location.toLowerCase()) || b.location.toLowerCase().includes(a.location.toLowerCase())) {
    score += 20;
  }

  const bTags = new Set(b.tags.map((tag) => tag.toLowerCase()));
  const overlaps = a.tags.filter((tag) => bTags.has(tag.toLowerCase())).length;
  score += Math.min(overlaps * 8, 25);
  return Math.min(score, 100);
}

export function findMatches(item: Item, items: Item[]) {
  return items
    .filter((candidate) => candidate.id !== item.id)
    .map((candidate) => ({ item: candidate, score: scoreMatch(item, candidate) }))
    .filter((match) => match.score >= 35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}
