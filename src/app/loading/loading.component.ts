import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  public showGoHomeButton = false;

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.showGoHomeButton = true;
    }, 10000);
  }

  /** Go home **/
  goHome() {
    /*
      Workaround for redirecting to the / page when you're already there.
     */
    this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/']);
    });
  }
}
