export const normalizeAgeGroup = (ageGroup: string) => {
  if (!ageGroup) return null;

  if (ageGroup === '<1') return `0 a 1`;

  if (ageGroup.toLowerCase() === '80 e mais') return `80 a 120`;

  return ageGroup.toLowerCase();
}
