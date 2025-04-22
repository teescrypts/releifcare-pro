import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export function convertToAmPmFormat(time: string): string {
  return dayjs(time, "HH:mm").format("hh:mm A");
}
