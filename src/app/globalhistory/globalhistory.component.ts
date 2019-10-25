import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DataService} from '../services/data.service';
import {Router} from '@angular/router';
import {forkJoin} from 'rxjs';
import {Purchase} from '../classes/purchase';
import {Product} from '../classes/product';
import {User} from '../classes/user';

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
  private products: Product[];
  private productMap: Map<number, Product> = new Map();
  private users: User[];
  private userMap: Map<number, User> = new Map();
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 10;
  private maxPurchases = 200;
  displayedColumns: string[] = ['id', 'timestamp', 'name', 'amount', 'product'];
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }

  /** Load all necessary data from the backend. */
  loadData() {
    const users = this.dataService.getUsers();
    const purchases = this.dataService.getPurchases(this.maxPurchases);
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
      this.users.forEach(user => {
        this.userMap.set(user.id, user);
      });
      this.products.forEach(product => {
        this.productMap.set(product.id, product);
      });
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
