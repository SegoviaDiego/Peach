export default class Total {
  _current: Boolean;
  day: Date;
  start: Date;
  end: Date;
  total: any;
  data: any;

  constructor(_current: boolean, total: any, data: any) {
    this._current = _current;
    this.total = total;
    this.data = data;
    this.start = new Date();
    this.end = new Date();
    this.day = new Date();
    this.day.setHours(0, 0, 0, 0);
  }
}
