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

export function magnitude(type: number) {
  switch (type) {
    case 1:
      return " Gr";
    case 2:
    default:
      return " Kg";
  }
}

export function composeMagnitude(amount: number, type: number) {
  return toMagnitude(amount, type) + magnitude(type);
}

export function toMagnitude(amount: number, type: number) {
  switch (type) {
    case 1:
      return amount;
    case 2:
    default:
      return amount / 1000;
  }
}

export function fromMagnitude(amount: number, type: number): number {
  switch (type) {
    case 1:
      return amount;
    case 2:
    default:
      return amount * 1000;
  }
}
