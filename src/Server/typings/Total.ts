export default class Total {
  _current: Boolean;
  date: Date;
  total: any;
  cierres: any;

  constructor(_current: boolean, date: Date, total: any, cierres: any) {
    this._current = _current;
    this.date = date;
    this.total = total;
    this.cierres = cierres;
  }
}
