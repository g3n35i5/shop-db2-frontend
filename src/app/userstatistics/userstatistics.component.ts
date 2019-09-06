import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { User } from '../interfaces/user';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { forkJoin } from 'rxjs';
import { Product } from '../interfaces/product';
import { Purchase } from '../interfaces/purchase';
import * as moment from 'moment-timezone';
import { MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ChartCard } from '../interfaces/chartcard';
import {interpretStatements} from '@angular/compiler/src/output/output_interpreter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-userstatistics',
  templateUrl: './userstatistics.component.html',
  styleUrls: ['./userstatistics.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class UserstatisticsComponent implements OnInit {

  // options

  private userID: number;
  private user: User;
  private products: Product[];
  private purchases: Purchase[];
  private filteredPurchases: Purchase[];
  private numFavoritesToShow = 10;
  private favorites: number[];

  startDatepickerCtl = new FormControl(moment(new Date()));
  endDatepickerCtl = new FormControl(moment(new Date()));

  minDate = moment(new Date());
  maxDate = moment(new Date());

  public loaded = false;

  cards: ChartCard[] = [
    {
      title: 'Top ' + this.numFavoritesToShow.toString() + ' Products',
      data: [],
      type: 'pie'
    },
    {
      title: 'Distribution of purchases over the week',
      data: [],
      type: 'bar',
      xAxisLabel: 'Day',
      yAxisLabel: 'Count',
      showXAxisLabel: false,
      showYAxisLabel: true
    },
    {
      title: 'Purchase Activity',
      data: [],
      type: 'line',
      xAxisLabel: 'Date',
      yAxisLabel: 'Purchases',
      showXAxisLabel: true,
      showYAxisLabel: true,
      interpolation: 'binary'
    },
    {
      title: 'Distribution of purchases over the day',
      data: [],
      type: 'line',
      xAxisLabel: 'Hour',
      yAxisLabel: 'Count',
      showXAxisLabel: true,
      showYAxisLabel: true,
      interpolation: 'smooth'
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

      // Get the date of the first purchase.
      const sortedPurchases = this.purchases.sort(function(a, b) { return moment(a.timestamp).valueOf() - moment(b.timestamp).valueOf(); });
      this.minDate = moment(sortedPurchases[0].timestamp);
      this.startDatepickerCtl.setValue(this.minDate);
      this.processingData();
    });
  }

  processingData() {
    // Set loaded to false;
    this.loaded = false;

    this.cards.forEach(card => card.data = []);
    // Get date of first purchase

    this.filteredPurchases = this.purchases.filter(
      purchase => moment(purchase.timestamp).isBetween(this.startDatepickerCtl.value, this.endDatepickerCtl.value));

    // Get favorite products
    const trimmedFavorites = this.favorites.slice(0, Math.min(...[10, this.favorites.length]));
    const favs = [];
    trimmedFavorites.forEach(id => {
      const product = this.products.find(p => p.id === id);
      if (product) {
        favs.push(product);
        let counter = 0;
        const filtered = this.filteredPurchases.filter(p => p.product_id === id);
        filtered.forEach(f => {
          counter += f.amount;
        });

        this.cards[0].data.push({name: product.name, value: counter});
      }
    });

    // Get weekday distribution
    const counts = [];
    moment.weekdays(true).forEach(weekday => {
      counts.push({name: weekday, value: 0});
    });
    this.filteredPurchases.forEach(purchase => {
      const moment_ts = moment(Date.parse(purchase.timestamp));
      const day_string = moment_ts.format('dddd');
      counts.find(x => x.name === day_string).value += 1;
    });

    this.cards[1].data = counts;

    // Get purchase activity
    const purchase_activity = [{name: 'Count', series: []}];
    this.filteredPurchases.forEach(purchase => {
      const item = purchase_activity[0].series.find(x => this.sameDay(x.name, new Date(purchase.timestamp)));
      if (item) {
        item.value += purchase.amount;
      } else {
        purchase_activity[0].series.push({name: new Date(purchase.timestamp), value: purchase.amount});
      }
    });

    const dateArray = purchase_activity[0].series.map(item => item.name);

    for (const date = new Date(this.startDatepickerCtl.value); date.valueOf() <= this.endDatepickerCtl.value; date.setDate(date.getDate() + 1)) {
      if (!this.dayIsInArray(date, dateArray)) {
        purchase_activity[0].series.push({name: new Date(date), value: 0});
      }
    }
    this.cards[2].data = purchase_activity;

    // Get day time distribution
    const hour_counts = [{name: 'Count', series: []}];
    for (let hour = 0; hour < 24; hour++) {
      hour_counts[0].series.push({name: hour, value: 0});
    }
    this.filteredPurchases.forEach(purchase => {
      const moment_ts = moment(new Date(purchase.timestamp));
      const hour = moment_ts.hour();
      hour_counts[0].series.find(x => x.name === hour).value ++;
    });
    hour_counts.sort((a, b) => (a.name > b.name) ? 1 : -1);
    this.cards[3].data = hour_counts;
    this.loaded = true;
  }

  sameDay(ts1: Date, ts2: Date): boolean {
    return ts1.getFullYear() === ts2.getFullYear() &&
      ts1.getMonth() === ts2.getMonth() &&
      ts1.getDate() === ts2.getDate();
  }

  dayIsInArray(ts: Date, date_array: Date[]): boolean {
    date_array.forEach(value => {
      if (this.sameDay(value, ts)) { return true; }
    });
    return false;
  }

  showCharts() {
    return this.filteredPurchases.length > 0;
  }

  updateStats(event) {
    this.processingData();
  }

  getUsername(): string {
    return [this.user.firstname, this.user.lastname].join(' ');
  }

  goBackToShop() {
    this.router.navigate(['/shop', this.userID]);
  }
}
