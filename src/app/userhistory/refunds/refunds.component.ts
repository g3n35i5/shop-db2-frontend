import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../services/data.service';
import { forkJoin } from 'rxjs';
import { User } from '../../interfaces/user';
import { Refund } from '../../interfaces/refund';

@Component({
  selector: 'app-refunds',
  templateUrl: './refunds.component.html',
  styleUrls: ['./refunds.component.scss']
})
export class RefundsComponent implements OnInit {

  @Input() user: User;

  /** Define all needed variables. */
  public loading: boolean;
  public disableInteraction: boolean;
  public showTable: boolean;
  public refunds: Refund[];
  private users: User[];
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 10;
  displayedColumns: string[] = ['id', 'total_price', 'admin', 'comment', 'timestamp'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

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
    const refunds = this.dataService.getUserRefunds(this.user.id);
    const users = this.dataService.getUsers();
    forkJoin([refunds, users]).subscribe(results => {
      this.refunds = results[0];
      this.users = results[1];
      this.processingData();
    });
  }

  /** Process the loaded data and ends the loading state.  */
  processingData() {
    const that = this;
    if (this.refunds.length > 0) {
      this.dataSource = new MatTableDataSource(this.refunds);
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return that.getUsername(data.admin).toLowerCase().includes(filter) || data.comment.toLowerCase().includes(filter);
      };
      for (const deposit of this.refunds) {
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

  getUsername(user: User): string {
    return this.dataService.getUsername(user);
  }
}
