import Product from "@/Server/mongodb/Product";

export function equalDates(a: Date, b: Date) {
  if (!a || !b) return false;
  return (
    a.getDate() == b.getDate() &&
    a.getMonth() == b.getMonth() &&
    a.getFullYear() == b.getFullYear()
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

export function composeSystelToKg(systelTotals: [any]): Promise<any> {
  return new Promise(async resolve => {
    let totals: any = [];
    let products: any = await Product.loadProducts();

    for (let item of systelTotals) {
      totals.push({
        _id: item.ID_PLU,
        money: item.PE,
        amount:
          products[item.ID_PLU].type == 1 ? toMagnitude(item.CA, 3) : item.CA
      });
    }

    resolve(totals);
  });
}

export function magnitude(type: number) {
  switch (type) {
    case 0:
      return " U";
    case 1:
    case 3: //Gr to Kg
      return " Kg";
    case 2:
      return " Gr";
    default:
      return "";
  }
}

export function composeMagnitude(amount: number, type: number) {
  return toMagnitude(amount, type).toFixed(3) + magnitude(type);
}

export function toMagnitude(amount: number, type: number) {
  switch (type) {
    case 0: // Unidad
      return amount;
    case 1: // Kg
      return amount;
    case 2: // Kg to Gr
      return amount * 1000;
    case 3: // Gr to Kg
      return amount / 1000;
    default:
      return amount;
  }
}

export function fromMagnitude(amount: number, type: number): number {
  switch (type) {
    case 0:
      return amount;
    case 1:
      return amount;
    case 2:
      return amount * 1000;
    default:
      return amount;
  }
}
