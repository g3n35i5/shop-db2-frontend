import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../services/data.service';
import {forkJoin} from 'rxjs';
import {Product} from '../interfaces/product';
import * as moment from 'moment-timezone';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {ChartCard} from '../interfaces/chartcard';
import {CustomCurrency} from '../filters';
import {User} from '../classes/user';
import {Purchase} from '../classes/purchase';
import {Deposit} from '../classes/deposit';
import {Refund} from '../classes/refund';
import {Moment} from 'moment';
import {colorSets} from '@swimlane/ngx-charts/release/utils';

// Date compare function
export function _dateCompareFn(date1: Moment, date2: Moment): number {
  return date1.valueOf() - date2.valueOf();
}

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
    CustomCurrency
  ],
})
export class UserstatisticsComponent implements OnInit {

  // options

  private userID: number;
  private user: User;
  private products: Product[];
  private purchases: Purchase[];
  private deposits: Deposit[];
  private refunds: Refund[];
  private sortedPurchases: Purchase[];
  private sortedDeposits: Deposit[];
  private sortedRefunds: Refund[];
  private filteredPurchases: Purchase[];
  private filteredDeposits: Deposit[];
  private filteredRefunds: Refund[];
  private numFavoritesToShow = 10;
  private favorites: number[];

  startDatepickerCtl = new FormControl(moment(new Date()));
  endDatepickerCtl = new FormControl(moment(new Date()));

  public colorSchemes = colorSets;
  public selectedColorScheme: any = this.colorSchemes[2];

  globalMinDate = moment(new Date());
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
      yAxisLabel: 'Percent',
      showXAxisLabel: false,
      showYAxisLabel: true
    },
    {
      title: 'Purchase Activity',
      data: [],
      type: 'area',
      xAxisLabel: 'Date',
      yAxisLabel: 'Purchases',
      showXAxisLabel: true,
      showYAxisLabel: true,
      interpolation: 'binary'
    },
    {
      title: 'Distribution of purchases over the day',
      data: [],
      type: 'area',
      xAxisLabel: 'Hour',
      yAxisLabel: 'Percent',
      showXAxisLabel: true,
      showYAxisLabel: true,
      interpolation: 'smooth',
      yScaleMin: 0
    },
    {
      title: 'Credit over time',
      data: [],
      type: 'area',
      xAxisLabel: 'Date',
      yAxisLabel: 'Credit',
      showXAxisLabel: true,
      showYAxisLabel: true,
      interpolation: 'binary'
    },
    {
      title: 'Expenses over time',
      data: [],
      type: 'area',
      xAxisLabel: 'Date',
      yAxisLabel: 'Euro',
      showXAxisLabel: true,
      showYAxisLabel: true,
      interpolation: 'binary'
    }

  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private currencyPipe: CustomCurrency
  ) {
  }

  ngOnInit() {
    this.userID = this.route.snapshot.params['id'];
    this.loadData();
  }

  loadData() {
    const user = this.dataService.getUser(this.userID);
    const products = this.dataService.getProducts();
    const favorites = this.dataService.getFavorites(this.userID);
    const purchases = this.dataService.getUserPurchases(this.userID);
    const deposits = this.dataService.getUserDeposits(this.userID);
    const refunds = this.dataService.getUserRefunds(this.userID);

    forkJoin([user, products, favorites, purchases, deposits, refunds]).subscribe(results => {
      this.user = results[0];
      this.products = results[1];
      this.favorites = results[2];
      this.purchases = results[3];
      this.deposits = results[4];
      this.refunds = results[5];

      // Get the date of the first purchase.
      const sortedPurchases = this.purchases.length > 1 ? this.purchases.sort((a, b) => _dateCompareFn(a.timestamp, b.timestamp)) : this.purchases;
      const dateOfFirstPurchase = sortedPurchases.length > 0 ? sortedPurchases[0].timestamp : null;

      // Get the date of the first deposit.
      const sortedDeposits = this.deposits.length > 1 ? this.deposits.sort((a, b) => _dateCompareFn(a.timestamp, b.timestamp)) : this.deposits;
      const dateOfFirstDeposit = sortedDeposits.length > 0 ? sortedDeposits[0].timestamp : null;

      // Get the date of the first refund.
      const sortedRefunds = this.refunds.length > 1 ? this.refunds.sort((a, b) => _dateCompareFn(a.timestamp, b.timestamp)) : this.refunds;
      const dateOfFirstRefund = sortedRefunds.length > 0 ? sortedRefunds[0].timestamp : null;

      // Sort the dates
      const allDates = [dateOfFirstPurchase, dateOfFirstDeposit, dateOfFirstRefund];
      allDates.forEach(function (item, index, object) {
        if (item === null) {
          object.splice(index, 1);
        }
      });
      const sortedStartDates = allDates.length > 1 ? allDates.sort((a, b) => _dateCompareFn(a, b)) : allDates[0];

      // Get the date of the first "event"
      this.minDate = sortedStartDates[0];
      this.globalMinDate = sortedStartDates[0];

      this.startDatepickerCtl.setValue(this.globalMinDate);
      this.processingData();
    });
  }

  processingData() {
    // Set loaded to false;
    this.loaded = false;

    const startValue = this.startDatepickerCtl.value;
    const endValue = this.endDatepickerCtl.value;

    // Sort and filter purchases
    this.sortedPurchases = this.purchases.sort((a, b) => _dateCompareFn(a.timestamp, b.timestamp));
    this.filteredPurchases = this.sortedPurchases
      .filter(purchase => moment(purchase.timestamp).isBetween(startValue, endValue, null, '[]') && !purchase.revoked);


    // Filter deposits
    this.sortedDeposits = this.deposits.sort((a, b) => _dateCompareFn(a.timestamp, b.timestamp));
    this.filteredDeposits = this.sortedDeposits
      .filter(deposit => moment(deposit.timestamp).isBetween(startValue, endValue, null, '[]') && !deposit.revoked);

    // Filter refunds
    this.sortedRefunds = this.refunds.sort((a, b) => _dateCompareFn(a.timestamp, b.timestamp));
    this.filteredRefunds = this.sortedRefunds
      .filter(refund => moment(refund.timestamp).isBetween(startValue, endValue, null, '[]') && !refund.revoked);


    // Array that contains all dates between the two datepicker values
    const datesInBetween: Moment[] = [];
    for (const date = moment(startValue); date.valueOf() <= endValue; date.add(1, 'days')) {
      datesInBetween.push(date);
    }

    // Generate the favorite products chart
    this.createTopProductsChart();

    // Generate the purchase activity over the weekdays chart
    this.createWeekDistributionChart();

    // Generate the purchase activity over the days chart
    this.createPurchaseActivityChart(datesInBetween);

    // Generate the daily activity over the hours distribution chart
    this.createDayDistributionChart();

    // Generate the user credit over time chart
    this.createCreditOverTimeChart();

    // Generate the user credit over time chart
    this.createExpensesOverTimeChart();

    // Show the charts again
    this.loaded = true;
  }

  createTopProductsChart() {
    const favoriteData = [];
    const trimmedFavorites = this.favorites.slice(0, Math.min(...[10, this.favorites.length]));
    trimmedFavorites.forEach(id => {
      const product = this.products.find(p => p.id === id);
      if (product) {
        let counter = 0;
        const filtered = this.filteredPurchases.filter(p => p.product_id === id);
        filtered.forEach(f => {
          counter += f.amount;
        });

        favoriteData.push({name: product.name, value: counter});
      }
    });
    this.cards[0].data = favoriteData;
  }

  createWeekDistributionChart() {
    const counts = [];
    moment.weekdays(true).forEach(weekday => {
      counts.push({name: weekday, value: 0});
    });
    this.filteredPurchases.forEach(purchase => {
      const day_string = purchase.timestamp.format('dddd');
      counts.find(x => x.name === day_string).value += 1;
    });

    let sumCounts = 0;
    counts.forEach(item => sumCounts += item.value);
    counts.forEach(item => item.value = (item.value / sumCounts) * 100);

    this.cards[1].data = counts;
  }

  createPurchaseActivityChart(datesInBetween: Moment[]) {
    const purchase_activity = [{name: 'Count', series: []}];
    this.filteredPurchases.forEach(purchase => {
      const item = purchase_activity[0].series.find(x => this.sameDay(moment(x.name), purchase.timestamp));
      if (item) {
        item.value += purchase.amount;
      } else {
        purchase_activity[0].series.push({name: purchase.timestamp.toDate(), value: purchase.amount});
      }
    });

    const dateArray = purchase_activity[0].series.map(item => moment(item.name));

    /*
      On each day on which no purchase was made, a data point with the value 0 must be inserted.
    */
    datesInBetween.forEach(date => {
      if (!this.dayIsInArray(date, dateArray)) {
        purchase_activity[0].series.push({name: date.toDate(), value: 0});
      }
    });

    this.cards[2].data = purchase_activity;
  }

  createDayDistributionChart() {
    const hour_counts = [{name: 'Percent', series: []}];
    for (let hour = 0; hour < 24; hour++) {
      hour_counts[0].series.push({name: hour, value: 0});
    }
    this.filteredPurchases.forEach(purchase => {
      const hour = purchase.timestamp.hour();
      hour_counts[0].series.find(x => x.name === hour).value++;
    });
    hour_counts.sort((a, b) => (a.name > b.name) ? 1 : -1);

    let sumCounts = 0;
    hour_counts[0].series.forEach(item => sumCounts += item.value);
    hour_counts[0].series.forEach(item => item.value = (item.value / sumCounts) * 100);
    this.cards[3].data = hour_counts;
  }

  createCreditOverTimeChart(): void {
    const user_credit_over_time = [{name: 'Credit', series: []}];

    let current_credit = 0;

    let purchaseIndex = 0;
    let depositIndex = 0;
    let refundIndex = 0;

    for (const date = moment(this.globalMinDate); date <= moment(); date.add(1, 'days')) {
      while (true) {
        let continuePurchases = true;
        let continueDeposits = true;
        let continueRefunds = true;

        // Handle purchases
        if (purchaseIndex < this.sortedPurchases.length) {
          const currentPurchase = this.sortedPurchases[purchaseIndex];
          if (currentPurchase.timestamp <= date) {
            current_credit -= currentPurchase.price;
            purchaseIndex++;
          } else {
            continuePurchases = false;
          }
        } else {
          continuePurchases = false;
        }

        // Handle deposits
        if (depositIndex < this.sortedDeposits.length) {
          const currentDeposit = this.sortedDeposits[depositIndex];
          if (currentDeposit.timestamp <= date) {
            current_credit += currentDeposit.amount;
            depositIndex++;
          } else {
            continueDeposits = false;
          }
        } else {
          continueDeposits = false;
        }

        // Handle refunds
        if (refundIndex < this.sortedRefunds.length) {
          const currentRefund = this.sortedRefunds[refundIndex];
          if (currentRefund.timestamp <= date) {
            current_credit += currentRefund.total_price;
            refundIndex++;
          } else {
            continueRefunds = false;
          }
        } else {
          continueRefunds = false;
        }

        if (!continuePurchases && !continueDeposits && !continueRefunds) {
          break;
        }
      }

      if (this.minDate <= date && date <= this.maxDate) {
        user_credit_over_time[0].series.push({name: date.toDate(), value: this.currencyPipe.transform(current_credit).valueOf()});
      }
    }
    this.cards[4].data = user_credit_over_time;
  }

  createExpensesOverTimeChart(): void {
    const expenses_over_time = [{name: 'Expenses', series: []}];

    let current_expenses = 0;

    let purchaseIndex = 0;

    for (const date = moment(this.globalMinDate); date <= moment(); date.add(1, 'days')) {
      while (true) {
        let continuePurchases = true;

        // Handle purchases
        if (purchaseIndex < this.sortedPurchases.length) {
          const currentPurchase = this.sortedPurchases[purchaseIndex];
          if (currentPurchase.timestamp <= date) {
            current_expenses += currentPurchase.price;
            purchaseIndex++;
          } else {
            continuePurchases = false;
          }
        } else {
          continuePurchases = false;
        }

        if (!continuePurchases) {
          break;
        }
      }

      if (this.minDate <= date && date <= this.maxDate) {
        expenses_over_time[0].series.push({name: date.toDate(), value: this.currencyPipe.transform(current_expenses).valueOf()});
      }

    }

    this.cards[5].data = expenses_over_time;
  }

  _updatePeriod(startDate: Moment, endDate: Moment): void {
    // If the given start value lies before the first event, take the date of the first event
    if (startDate < this.globalMinDate) {
      startDate = this.globalMinDate;
    }

    // Update minDate and maxDate
    this.minDate = startDate;
    this.maxDate = endDate;

    // Update datepicker values
    this.startDatepickerCtl.setValue(startDate);
    this.endDatepickerCtl.setValue(endDate);

    // Update all plots
    this.processingData();
  }

  setLastWeek() {
    const startDate = moment().subtract(1, 'week');
    const endDate = moment();
    this._updatePeriod(startDate, endDate);
  }

  setLastMonth() {
    const startDate = moment().subtract(1, 'month');
    const endDate = moment();
    this._updatePeriod(startDate, endDate);
  }

  setLastThreeMonths() {
    const startDate = moment().subtract(3, 'month');
    const endDate = moment();
    this._updatePeriod(startDate, endDate);
  }

  setLastThreeYear() {
    const startDate = moment().subtract(1, 'year');
    const endDate = moment();
    this._updatePeriod(startDate, endDate);
  }

  resetTimePeriod() {
    const startDate = this.globalMinDate;
    const endDate = moment();
    this._updatePeriod(startDate, endDate);
  }

  /*
   *
   * Helper functions below
   *
   */

  /**
   * Returns whether the year, the month and the day of to days are equal. We don't care about the timestamp of the dates.
   *
   * @param date1 is the first date
   * @param date2 is the second date
   */
  sameDay(date1: Moment, date2: Moment): boolean {
    return date1.year() === date2.year() &&
      date1.month() === date2.month() &&
      date1.date() === date2.date();
  }

  /**
   * Returns whether an array of dates contains a specific day. The timestamp is not relevant.
   *
   * @param ts is the date
   * @param date_array is the array of dates
   */
  dayIsInArray(ts: Moment, date_array: Moment[]): boolean {
    return date_array.filter(date => this.sameDay(date, ts)).length > 0;
  }

  /**
   * Only when there are purchases in the selected time period, the charts should be rendered.
   */
  showCharts() {
    return this.filteredPurchases.length > 0;
  }

  /**
   * Each time the user selects a new start and/or end date, this function gets called and the charts are getting refreshed.
   * @param event is the event passed by the datepicker object.
   */
  updateStats(event) {
    this.processingData();
  }

  /**
   * Redirects the user to his shop page.
   */
  goBackToShop() {
    this.router.navigate(['/shop', this.userID]);
  }
}
