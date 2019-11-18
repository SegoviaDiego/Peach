import _ from "lodash";

export function equalDates(a: Date, b: Date) {
  if (!a || !b) return false;
  return (
    a.getDate() == b.getDate() &&
    a.getMonth() == b.getMonth() &&
    a.getFullYear() == b.getFullYear()
  );
}

export function validateInt(val: number) {
  return isNaN(val) ? 0 : val;
}

export function equalSells(a: any, b: any) {
  if (!a || !b) return false;
  return (
    parseFloat(a.money) == parseFloat(b.money) &&
    parseFloat(a.amount) == parseFloat(b.amount)
  );
}

let months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];

let days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado"
];

export function toHumanDate(date: Date) {
  return `${days[date.getDay()]} ${date.getDate()} de ${
    months[date.getMonth()]
  } de ${date.getFullYear()}`;
}

export function toHour(time: Date) {
  let hour: any = time.getHours();
  let minutes: any = time.getMinutes();

  if (time.getHours() < 10) hour = "0" + hour;

  if (time.getMinutes() < 10) minutes = "0" + minutes;

  return hour + ":" + minutes;
}

export function composeSystelToKg(
  products: any,
  systelTotals: [any]
): Promise<any> {
  return new Promise(async resolve => {
    let totals: any = [];
    products = _.mapKeys(products, (item: any) => {
      return item._id;
    });

    for (let item of systelTotals) {
      totals.push({
        item: products[item.ID_PLU],
        money: parseFloat(item.PE),
        amount:
          products[item.ID_PLU].type == 1
            ? toMagnitude(item.CA, 3)
            : parseFloat(item.CA)
      });
    }
    resolve(totals);
  });
}

export function magnitude(type: number) {
  switch (type) {
    case 0: // Unidad
      return " U";
    case 1: // Kilogramo
      return " Kg";
    case 2: // Metro
      return " m";
    case 3: //Gr to Kg
      return " Kg";
    case 7: // Litro
      return " L";
    default:
      return "";
  }
}

export function composeMagnitude(amount: number, type: number) {
  const value = toMagnitude(amount, type);
  const mag = magnitude(type);
  switch (type) {
    case 1:
      return value.toFixed(3) + mag;
    case 2:
      return value.toFixed(2) + mag;
    case 7:
      return value.toFixed(2) + mag;
    case 0:
    default:
      return value + mag;
  }
}

export function getProductMaxInputVal(stock: number) {
  if (stock < 0) return 0;
  return stock;
}

export function getProductTypeStep(type: number) {
  switch (type) {
    case 0:
      return 1;
    case 1:
      return 0.1;
    case 2:
      return 0.1;
    case 7:
      return 0.1;
    default:
      return 1;
  }
}

export function getProductTypeLabel(type: number) {
  switch (type) {
    case 0:
      return "Unidad";
    case 1:
      return "Kilogramo";
    case 2:
      return "Metro";
    case 7:
      return "Litro";
    default:
      return "";
  }
}

export function toMagnitude(amount: number, type: number) {
  switch (type) {
    case 0: // Unidad
      return amount;
    case 1: // Kg
      return amount;
    case 2: // Metro
      return amount;
    case 3: // Gr to Kg
      return amount / 1000;
    case 4: // Kg to Gr
      return amount * 1000;
    case 7: // Litro
      return amount;
    default:
      return amount;
  }
}

export function fromMagnitude(amount: number, type: number): number {
  switch (type) {
    case 3: // Gr a Kilogramo
      return amount * 1000;
    case 0: // Unidad
    case 1: // Kilogramo
    case 2: // Metro
    case 7: // Litro
    default:
      return amount;
  }
}
