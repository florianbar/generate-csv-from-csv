export function getTaxYears(): number[] {
  // create an array of tax years from 2018 to the current year
  const currentYear = new Date().getFullYear();
  const startYear = 2018;
  const taxYears = [];
  for (let year = startYear; year <= currentYear + 1; year++) {
    taxYears.push(year);
  }
  return taxYears;
}
