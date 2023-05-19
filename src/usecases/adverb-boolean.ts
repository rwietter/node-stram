type Adverb = 'NAO' | 'SIM' | '';

export const isTrueField = (adv: Adverb) => {
  switch (adv) {
    case 'NAO':
      return false;
    case 'SIM':
      return true;
    default:
      return null;
  }
}
