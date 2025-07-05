// create a function that takes a string and removes commas and full stops
// and converts it to a number
// For example:
// - "-0.00000001" and converts it to a number lik 1
// - "+1,000.00000001" and converts it to a number like 100000000001
export function convertFormattedStringToNumber(value: string): number {
  const cleanedString: string = value.slice(1).replace(/[,\.]/g, ""); // remove +/-, commas and full stops
  const number: number = parseFloat(cleanedString);

  if (isNaN(number)) {
    return 0;
  }

  return number;
}

// Take a number like:
// - 1 and convert it to "0.00000001"
// - 100000000001 and convert it to "1,000.00000001"
export function convertNumberToFormattedString(value: number): string {
  // Convert the number to its decimal representation (divide by 1e8)
  const decimalValue: number = value / 1e8;

  // Convert the number to a string with 8 decimal places
  const stringValue: string = decimalValue.toFixed(8);

  // Add commas to the string
  const parts: string[] = stringValue.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return parts.join(".");
}
