import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { CASES } from './messages';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  private subscription;
  private case: string;

  public message;

  public loading: boolean;
  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscription = this.route.data.subscribe(params => {
      this.case = params['case'];
      this.selectMessage();
    });
  }

  /**
   * Select the proper message based on the case defined by the routing.
   */
  selectMessage() {
    switch (this.case) {
      case 'offline': {
        this.message = CASES.offline;
        break;
      }
      case 'pagenotfound': {
        this.message = CASES.pagenotfound;
        break;
      }
      case 'maintenance': {
        this.message = CASES.maintenance;
        break;
      }
      default: {
        this.message = CASES.default;
        break;
      }
    }
    this.loading = false;
  }

  /** Returns the text for the retry button depending on the loading
   variable.*/
  buttonText() {
    return this.loading ? 'Loading...' : 'Retry';
  }

  /** Try to connect to the backend.*/
  retry () {
    /** Set the loading variable to true. This disables the button
     and switches the button text.*/
    this.loading = true;
    /** If the backend is online, redirect to the root url.*/
    this.dataService.backendOnline().subscribe(() => {
        this.router.navigate(['/']);
      },
      /** If the backend is still offline, stay on this page.*/
      () => {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
  }
}
