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

  private sortByLastname: boolean;

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
    const users = this.dataService.getUsers();
    const ranks = this.dataService.getRanks();
    forkJoin([users, ranks]).subscribe(results => {
      this.users = results[0]['users'];
      this.ranks = results[1]['ranks'];
      this.processingData();
    });
  }

  processingData(): void {
    this.sortUsers();
  }

  /**
   * Sort the user list by the selected key (lastname or firstname).
   */
  sortUsers(): void {
    const sortedUsers: SortedUsers[] = [];
    for (const user of this.users) {
      let key;
      if (this.sortByLastname) {
        key = user.lastname.charAt(0).toUpperCase();
      } else {
        key = user.firstname.charAt(0).toUpperCase();
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
        copied.users.sort((a, b) => a.lastname.localeCompare(b.lastname));
      }

      sortedUsers.sort((a, b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0));
      this.sortedUsers = sortedUsers;
    }
  }

  getRankName(user: User): string {
    return this.ranks.find(r => r.id === user.rank_id).name;
  }
}
