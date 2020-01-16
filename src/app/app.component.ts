import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  tmrDoneList = {};
  tmrClkList = {};
  clickCount = false;

  defaultTimerSt = 7.00;
  timerTime: string = this.defaultTimerSt.toString();

  setTimerTime() {
    if (this.timerTime.trim() === '' || !this.timerTime) {
      this.timerTime = this.defaultTimerSt.toString();
    }
  }

  clkGen() {
    const id = 'clock_' + Date.now();
    const obsev = new Observable(subscriber => {
      const setInt = setInterval(() => {
        if (!this.tmrClkList[id]) {
          clearInterval(setInt);
        } else {
          const newDate = new Date().toTimeString().slice(0, 8);
          subscriber.next(newDate);
        }
      }, 1);
    });
    this.tmrClkList[id] = {obsev};
  }

  tmrGen() {
    // this.tmrClkList.push(this.createTimer());
    const timeSent = Number.parseInt(this.timerTime);
    const {id, obsev} = this.createTimer(timeSent);
    this.tmrClkList[id] = {
      obsev,
      paused: false};
  }

  createTimer(timeSent) {
    const timeToSet = timeSent * 100;
    const timerTime = [timeToSet];
    const id = 'timer_' + Date.now();
    const tmrObs = this._privateTimer(timerTime, id);
    return {
      obsev: tmrObs,
      id,
      paused: false
    };
  }

  _privateTimer(timerTime, id) {
    const tmrObs = new Observable(subscriber => {
      const setInt = setInterval(() => {
        if (!this.tmrClkList[id]) {
          clearInterval(setInt);
        } else {
          if (timerTime[0] > 0) {
            if (!this.tmrClkList[id].paused) {
              subscriber.next((timerTime[0] / 100).toFixed(2));
              timerTime[0] = timerTime[0] - 1;
            }
          } else {
            clearInterval(setInt);
            subscriber.next((timerTime[0] / 100).toFixed(2));
            this.tmrDoneList[id] = true;
          }
        }
      }, 10);
    });
    return tmrObs;
  }

  cleanUp() {
    const delKeys = Object.keys(this.tmrDoneList);
    for (let key of delKeys) {
      delete(this.tmrClkList[key]);
    }
    this.tmrDoneList = {};
  }

  getList() {
    return Object.keys(this.tmrClkList);
  }

  getListLength() {
    return Object.keys(this.tmrClkList).length;
  }

  getDoneListLen() {
    return Object.keys(this.tmrDoneList).length;
  }

  clickItem(key) {
    // Single click to pause timer
    if (key.includes('timer')) {
      this.tmrClkList[key].paused = !this.tmrClkList[key].paused;
    }
  }

  deleteItem(key) {
    delete(this.tmrClkList[key]);
    if (this.tmrDoneList[key]) {
      delete(this.tmrDoneList[key]);
    }
    return false;
  }

}
