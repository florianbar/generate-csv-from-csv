import { parse, format } from "date-fns";

export function convertDateFormat(dateString: string): string {
  const parsedDate = parse(dateString, "MM/dd/yyyy, hh:mm:ss a", new Date());

  return format(parsedDate, "yyyy-MM-dd HH:mm:ss") + " UTC";
}
