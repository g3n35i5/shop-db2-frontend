import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import {User} from '../interfaces/user';

@Component({
  selector: 'app-userhistory',
  templateUrl: './userhistory.component.html',
  styleUrls: ['./userhistory.component.scss']
})
export class UserhistoryComponent implements OnInit {

  private userID: number;
  public user: User;
  public loaded = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.userID = this.route.snapshot.params['id'];
    this.dataService.getUser(this.userID).subscribe(result => {
      this.user = result;
      this.loaded = true;
    });
  }

  getUsername(): string {
    return [this.user.firstname, this.user.lastname].join(' ');
  }

  goBackToShop() {
    this.router.navigate(['/shop', this.userID]);
  }
}
