import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../services/data.service';
import { forkJoin } from 'rxjs';
import { Product } from '../../interfaces/product';
import { User } from '../../interfaces/user';
import { Purchase } from '../../classes/purchase';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {

  @Input() user: User;

  /** Define all needed variables. */
  public loading: boolean;
  public disableInteraction: boolean;
  public showTable: boolean;
  public purchases: Purchase[];
  private products: Product[];
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 10;
  displayedColumns: string[] = ['id', 'product', 'timestamp', 'amount',
    'productprice', 'price', 'revoke'];
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;



  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  /** Revoke a purchase. **/
  toggleRevoke(purchase) {
    this.disableInteraction = true;
    const data = { revoked: !purchase.revoked };
    this.dataService.togglePurchaseRevoke(purchase.id, data).subscribe(() => {
      this.loadData();
    });
  }

  /** Load all necessary data from the backend. */
  loadData() {
    const purchases = this.dataService.getUserPurchases(this.user.id);
    const products = this.dataService.getProducts();
    forkJoin([purchases, products]).subscribe(results => {
      this.purchases = results[0];
      this.products = results[1];
      this.processingData();
    });
  }

  /** Process the loaded data and ends the loading state.  */
  processingData() {
    if (this.purchases.length > 0) {
      for (const purchase of this.purchases) {
        purchase.product = this.products.find(p => p.id === purchase.product_id);
      }
      this.dataSource = new MatTableDataSource(this.purchases);
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.product.name.toLowerCase().includes(filter);
      };
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.showTable = true;
    } else {
      this.showTable = false;
    }
    this.loading = false;
    this.disableInteraction = false;
  }

  /** Filter the purchases depending on the current filter value.  */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
