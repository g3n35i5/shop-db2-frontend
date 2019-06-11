import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creditwarning',
  templateUrl: './creditwarning.component.html',
  styleUrls: ['./creditwarning.component.scss']
})
export class CreditwarningComponent implements OnInit {

  public credit: number;
  public debtLimit: number;
  private interval;

  counter: number;

  constructor(
    public router: Router,
    public dialogRef: MatDialogRef<CreditwarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.credit = this.data.credit;
    this.debtLimit = this.data.debtLimit;
    this.counter = Math.ceil(Math.abs(this.credit / 100));
    this.startTimer();
  }

  /** Returns the remaining waiting time. **/
  timeLeft() {
    return this.counter >= 0 ? this.counter : 0;
  }

  /** Indicates whether this user is allowed to use the shop. **/
  canStillShop() {
    return this.credit > this.debtLimit;
  }

  /** Go home **/
  goHome() {
    this.dialogRef.close();
    this.router.navigate(['/']);
  }

  /** Indicates whether to disable the close button. **/
  disableClose() {
    return this.counter > 0;
  }

  /** Starts the countdown. **/
  startTimer() {
    this.interval = setInterval(() => {
      this.counter--;
    }, 1000);
  }
}
