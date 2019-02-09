import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Purchase } from '../interfaces/purchase';
import { Product } from '../interfaces/product';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-globalhistory',
  templateUrl: './globalhistory.component.html',
  styleUrls: ['./globalhistory.component.scss']
})
export class GlobalhistoryComponent implements OnInit {

  /** Define all needed variables. */
  public loading: boolean;
  public showTable: boolean;
  public purchases: Purchase[];
  public products: Product[];
  public users: User[];
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 10;
  displayedColumns: string[] = ['id', 'timestamp', 'name', 'product'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  getUsername(user: User) {
    return this.dataService.getUsername(user);
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }

  /** Load all necessary data from the backend. */
  loadData() {
    const users = this.dataService.getUsers();
    const purchases = this.dataService.getPurchases();
    const products = this.dataService.getProducts();
    forkJoin([users, purchases, products]).subscribe(results => {
      this.users = results[0];
      this.purchases = results[1];
      this.products = results[2];
      this.processingData();
    });
  }

  /** Process the loaded data and ends the loading state.  */
  processingData() {
    if (this.purchases.length > 0) {
      for (const purchase of this.purchases) {
        purchase.user = this.users.find(u => u.id === purchase.user_id);
        purchase.product = this.products.find(p => p.id === purchase.product_id);
      }
      this.dataSource = new MatTableDataSource(this.purchases);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.showTable = true;
    } else {
      this.showTable = false;
    }
    this.loading = false;
  }
}
