export const filterCountryBirth = (pais: string) => {
  if (!pais) return null;

  if (pais.toUpperCase() === 'NAO ENCONTRADO') return null;

  return pais.toUpperCase();
}
