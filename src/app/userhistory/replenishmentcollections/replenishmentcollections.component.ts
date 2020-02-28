import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DataService} from '../../services/data.service';
import {forkJoin} from 'rxjs';
import {User} from '../../classes/user';
import {Replenishmentcollection} from '../../classes/replenishmentcollection';

@Component({
  selector: 'app-replenishmentcollcetions',
  templateUrl: './replenishmentcollections.component.html',
  styleUrls: ['./replenishmentcollections.component.scss']
})
export class ReplenishmentcollectionsComponent implements OnInit {

  @Input() user: User;

  /** Define all needed variables. */
  public loading: boolean;
  public disableInteraction: boolean;
  public showTable: boolean;
  public replenishmentcollcetions: Replenishmentcollection[];
  private users: User[];
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 10;
  displayedColumns: string[] = ['id', 'timestamp', 'admin', 'comment', 'price'];
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
    const replenishmentcollcetions = this.dataService.getUserReplenishmentcollections(this.user.id);
    const users = this.dataService.getUsers();
    forkJoin([replenishmentcollcetions, users]).subscribe(results => {
      this.replenishmentcollcetions = results[0];
      this.users = results[1];
      this.processingData();
    });
  }

  /** Process the loaded data and ends the loading state.  */
  processingData() {
    const that = this;
    if (this.replenishmentcollcetions.length > 0) {
      this.dataSource = new MatTableDataSource(this.replenishmentcollcetions);
      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return data.admin.getUsername().toLowerCase().includes(filter) || data.comment.toLowerCase().includes(filter);
      };
      for (const replenishmentcollection of this.replenishmentcollcetions) {
        replenishmentcollection.admin = this.users.find(u => u.id === replenishmentcollection.admin_id);
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
