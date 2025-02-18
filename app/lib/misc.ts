export function capitalizeFirstLetter(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

export function parseAndStringify(obj: object | null) {
  return obj ? JSON.parse(JSON.stringify(obj)) : null;
}

export const gainGreen = "#2dfc87";
export const lossRed = "#ff5e5e";
