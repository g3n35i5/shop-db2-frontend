import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  /** Return to the root url. */
  return () {
    this.router.navigate(['/']);
  }
}
