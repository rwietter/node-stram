export const toIsoDate = (date: string) => {
  if (!date) return null;

  const [day, month, year] = date.split('/');
  const dateISOString = `${year}-${month}-${day}`;

  const dateObject = new Date(dateISOString);
  const gmtBrazil = dateObject.getTimezoneOffset() / 60;
  dateObject.setHours(dateObject.getHours() + gmtBrazil);

  return dateObject.toISOString()
}
