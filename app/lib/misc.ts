export function capitalizeFirstLetter(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

export function parseAndStringify(obj: object | null) {
  return obj ? JSON.parse(JSON.stringify(obj)) : null;
}

export const gainGreen = "#2dfc87";
export const lossRed = "#ff5e5e";

export default function convertDataCurrency(convertTo: string, data: any) {
  //tdl do proper currency conversion
  // console.log(convertTo, data);
  return {
    ...data,
    currencyConverted: true,
    realizedGL:
      convertTo === "RM"
        ? data.realizedGL.times(4.25).toDecimalPlaces(2)
        : data.realizedGL.dividedBy(4.25).toDecimalPlaces(2),
    totalCost:
      convertTo === "RM"
        ? data.totalCost.times(4.25).toDecimalPlaces(2)
        : data.totalCost.dividedBy(4.25).toDecimalPlaces(2),
  };
}
