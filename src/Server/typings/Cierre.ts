export default class Cierre {
  _current: Boolean;
  date: Date;
  total: any;
  data: any;

  constructor(_current: boolean, date: Date, total: any, data: any) {
    this._current = _current;
    this.date = date;
    this.total = total;
    this.data = data;
  }
}
