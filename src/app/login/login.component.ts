import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { SettingsService } from '../settings/settings.service';
import { User } from '../interfaces/user';
import { Rank } from '../interfaces/rank';
import { SortedUsers } from '../interfaces/sortedusers';
import { forkJoin } from 'rxjs';
import {Sort} from '@angular/material';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public sortByLastname: boolean;
  public loading: boolean;

  private users: User[];
  private ranks: Rank[];
  public sortedUsers: SortedUsers[];

  constructor(
    private dataService: DataService,
    private settingsService: SettingsService
  ) {
    this.sortByLastname = this.settingsService.getStateByID('sortByLastname');
    this.loadData();
  }

  ngOnInit() {
  }

  loadData(): void {
    this.loading = true;
    const users = this.dataService.getUsers();
    const ranks = this.dataService.getRanks();
    forkJoin([users, ranks]).subscribe(results => {
      this.users = results[0];
      this.ranks = results[1];
      this.processingData();
    });
  }

  processingData(): void {
    this.sortUsers();
    this.loading = false;
  }

  /**
   * Sort the user list by the selected key (lastname or firstname).
   */
  sortUsers(): void {
    const sortedUsers: SortedUsers[] = [];
    for (const user of this.users) {
      let key;
      const firstname = user.firstname;
      const lastname = user.lastname;
      if (this.sortByLastname) {
        key = lastname.charAt(0).toUpperCase();
      } else {
        // It is possible that a user's firstname is empty.
        // For this reason, it may still be necessary to sort by lastname.
        key = firstname ? firstname.charAt(0).toUpperCase() : lastname.charAt(0).toUpperCase();
      }

      const item = sortedUsers.find(s => s.key === key);
      if (item) {
        item.users.push(user);
      } else {
        sortedUsers.push({key: key, users: [user]});
      }

      /** Sort all users. **/
      const keys = sortedUsers.map(s => s.key);
      for (const _key of keys) {
        const copied = sortedUsers.find(s => s.key === _key);
        copied.users.sort(this._userSortFn(this.sortByLastname));
      }

      sortedUsers.sort((a, b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0));
      this.sortedUsers = sortedUsers;
    }
  }

  getRankName(user: User): string {
    return this.ranks.find(r => r.id === user.rank_id).name;
  }

  _userSortFn(sortByLastName: boolean) {
    return (user1: User, user2: User) => {
      let k1, k2;
      if (sortByLastName) {
        k1 = user1.lastname;
        k2 = user2.lastname;
      } else {
        k1 = user1.firstname;
        k2 = user2.firstname;
      }
      if (k1 === null) {
        return 1;
      } else if (k2 === null) {
        return -1;
      } else if (k1 === k2) {
        return 0;
      } else  {
        return k1 < k2 ? -1 : 1;
      }
    };
  }
}
