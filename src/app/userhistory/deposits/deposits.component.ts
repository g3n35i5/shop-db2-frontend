import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../services/data.service';
import { forkJoin } from 'rxjs';
import { Deposit } from '../../classes/deposit';
import {User} from '../../classes/user';

@Component({
  selector: 'app-deposits',
  templateUrl: './deposits.component.html',
  styleUrls: ['./deposits.component.scss']
})
export class DepositsComponent implements OnInit {

  @Input() user: User;

  /** Define all needed variables. */
  public loading: boolean;
  public disableInteraction: boolean;
  public showTable: boolean;
  public deposits: Deposit[];
  private users: User[];
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 10;
  displayedColumns: string[] = ['id', 'amount', 'admin', 'comment', 'timestamp'];
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private dataService: DataService
  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  /** Load all necessary data from the backend. */
  loadData() {
    const deposits = this.dataService.getUserDeposits(this.user.id);
    const users = this.dataService.getUsers();
    forkJoin([deposits, users]).subscribe(results => {
      this.deposits = results[0];
      this.users = results[1];
      this.processingData();
    });
  }

  /** Process the loaded data and ends the loading state.  */
  processingData() {
    const that = this;
    if (this.deposits.length > 0) {
      this.dataSource = new MatTableDataSource(this.deposits);
      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return data.admin.getUsername().toLowerCase().includes(filter) || data.comment.toLowerCase().includes(filter);
      };
      for (const deposit of this.deposits) {
        deposit.admin = this.users.find(u => u.id === deposit.admin_id);
      }
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.showTable = true;
    } else {
      this.showTable = false;
    }
    this.loading = false;
    this.disableInteraction = false;
  }

  /** Filter the deposits depending on the current filter value.  */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
