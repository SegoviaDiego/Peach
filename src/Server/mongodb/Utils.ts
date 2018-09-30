export function equalDates(a: Date, b: Date) {
  if (!a || !b) return false;
  return (
    a.getDate() == b.getDate() &&
    a.getMonth() == b.getMonth() &&
    a.getFullYear() == b.getFullYear()
  );
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
