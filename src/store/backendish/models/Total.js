export function Total(_current, date, total, cierres) {
  this._current = _current;
  this.date = date;
  this.total = total;
  this.cierres = cierres;
}

export function Cierre(_current, date, total, data) {
  this._current = _current;
  this.date = date;
  this.total = total;
  this.data = data;
}
