import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { forkJoin } from 'rxjs';
import { Product } from '../interfaces/product';
import { Purchase } from '../interfaces/purchase';
import * as moment from 'moment-timezone';




@Component({
  selector: 'app-userstatistics',
  templateUrl: './userstatistics.component.html',
  styleUrls: ['./userstatistics.component.scss']
})
export class UserstatisticsComponent implements OnInit {

  // options

  private userID: number;
  private user: User;
  private products: Product[];
  private purchases: Purchase[];
  private favorites: number[];
  public loaded = false;

  private numFavoritesToShow = 10;

  cards: any[] = [
    {
      title: 'Top ' + this.numFavoritesToShow.toString() + ' Products',
      data: [],
      type: 'pie'
    },
    {
      title: 'Distribution of purchases over the week',
      data: [],
      legend: moment.weekdays(true),
      type: 'bar'
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.userID = this.route.snapshot.params['id'];
    this.loadData();
  }

  loadData() {
    const user = this.dataService.getUser(this.userID);
    const products = this.dataService.getProducts();
    const favorites = this.dataService.getFavorites(this.userID);
    const purchases = this.dataService.getUserPurchases(this.userID);
    forkJoin([user, products, favorites, purchases]).subscribe(results => {
      this.user = results[0];
      this.products = results[1];
      this.favorites = results[2];
      this.purchases = results[3];
      this.processingData();
    });
  }

  processingData() {
    const trimmedFavorites = this.favorites.slice(0, Math.min(...[10, this.favorites.length]));
    const favs = [];
    trimmedFavorites.forEach(id => {
      const product = this.products.find(p => p.id === id);
      if (product) {
        favs.push(product);
        let counter = 0;
        const filtered = this.purchases.filter(p => p.product_id === id);
        filtered.forEach(f => {
          counter += f.amount;
        });

        this.cards[0].data.push({name: product.name, value: counter});
      }
    });

    const counts = [];
    moment.weekdays(true).forEach(weekday => {
      counts.push({name: weekday, value: 0});
    });
    this.purchases.forEach(purchase => {
      const moment_ts = moment(new Date(purchase.timestamp));
      const day_index = moment_ts.isoWeekday();
      const day_string = moment_ts.format('dddd');
      counts.find(x => x.name === day_string).value += 1;
    });

    this.cards[1].data = counts;
    this.loaded = true;
  }

  getUsername(): string {
    return [this.user.firstname, this.user.lastname].join(' ');
  }

  goBackToShop() {
    this.router.navigate(['/shop', this.userID]);
  }
}
