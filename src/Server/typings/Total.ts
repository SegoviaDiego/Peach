export default class Total {
  _current: Boolean;
  day: Date;
  start: Date;
  end: Date;
  total: any;
  cierres: any;

  constructor(_current: boolean, total: any, cierres: any) {
    this._current = _current;
    this.total = total;
    this.cierres = cierres;
    this.start = new Date();
    this.end = new Date();
    this.day = new Date();
    this.day.setHours(0, 0, 0, 0);
  }
}
