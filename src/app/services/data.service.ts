import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';
import {Product} from '../interfaces/product';
import {map} from 'rxjs/operators';
import {Rank} from '../interfaces/rank';
import {Tag} from '../interfaces/tag';
import {User} from '../classes/user';
import {Deposit} from '../classes/deposit';
import {Refund} from '../classes/refund';
import {Purchase} from '../classes/purchase';
import {environment} from '../../environments/environment';
import {plainToClass} from 'class-transformer';


@Injectable({
  providedIn: 'root'
})

export class DataService {

  apiURL = environment.apiURL;

  umlautMap = {
    '\u00dc': 'UE',
    '\u00c4': 'AE',
    '\u00d6': 'OE',
    '\u00fc': 'ue',
    '\u00e4': 'ae',
    '\u00f6': 'oe',
    '\u00df': 'ss',
  };

  constructor(
    public http: HttpClient
  ) {
  }

  /**
   * This function replaces German umlauts with their international representation.
   * @param input is the input string with umlauts.
   */
  public replaceUmlauts(input) {
    return input
      .replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
        const big = this.umlautMap[a.slice(0, 1)];
        return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1);
      })
      .replace(new RegExp('[' + Object.keys(this.umlautMap).join('|') + ']', 'g'),
        (a) => this.umlautMap[a]
      );
  }

  public getUsers(): Observable<User[]> {
    return this.getData('users').pipe(map(result => {
      return plainToClass(User, <any[]>result['users']);
    }));
  }

  public getUser(id: number): Observable<User> {
    return this.getData('users/' + id.toString()).pipe(map((result: any) => {
      return plainToClass(User, result['user']);
    }));
  }

  public getProducts(): Observable<Product[]> {
    return this.getData('products').pipe(map(result => {
      return result['products'];
    }));
  }

  public getPurchases(limit?: number): Observable<Purchase[]> {
    const url = 'purchases' + (limit ? '?limit=' + limit.toString() : '');
    return this.getData(url).pipe(map(result => {
      return result['purchases'];
    }));
  }

  public getFavorites(id: number): Observable<number[]> {
    return this.getData('users/' + String(id) + '/favorites').pipe(map(result => {
      return result['favorites'];
    }));
  }

  public getRanks(): Observable<Rank[]> {
    return this.getData('ranks').pipe(map(result => {
      return result['ranks'];
    }));
  }

  public getTags(): Observable<Tag[]> {
    return this.getData('tags').pipe(map(result => {
      return result['tags'];
    }));
  }

  public getUserPurchases(id: number): Observable<Purchase[]> {
    return this.getData('users/' + String(id) + '/purchases').pipe(map((result: any) => {
      return plainToClass(Purchase, <any[]>result['purchases']);
    }));
  }

  public getUserDeposits(id: number): Observable<Deposit[]> {
    return this.getData('users/' + String(id) + '/deposits').pipe(map((result: any) => {
      return plainToClass(Deposit, <any[]>result['deposits']);
    }));
  }

  public getUserRefunds(id: number): Observable<Refund[]> {
    return this.getData('users/' + String(id) + '/refunds').pipe(map((result: any) => {
      return plainToClass(Refund, <any[]>result['refunds']);
    }));
  }

  public togglePurchaseRevoke(id: number, data: any) {
    return this.putData('purchases/' + id.toString(), data);
  }

  public createPurchase(data) {
    return this.postData('purchases', data);
  }

  public registerUser(data: any) {
    return this.postData('register', data);
  }

  public backendOnline() {
    return this.http.get(this.apiURL);
  }

  private getData(route) {
    return this.makeRequest(route, null, 'GET');
  }

  private postData(route, data) {
    return this.makeRequest(route, data, 'POST');
  }

  private putData(route, data) {
    return this.makeRequest(route, data, 'PUT');
  }

  private makeRequest(route, data, type) {
    /**
     * Check if the backend is available. If this is not the case,
     * the HTTP_INTERCEPTOR will redirect you to the offline page
     * and cancel the request.
     */
    this.http.get(this.apiURL);

    /** Switch case for the different request methods. */
    if (type === 'GET') {
      return this.http.get(this.apiURL + route);
    } else if (type === 'POST') {
      return this.http.post(this.apiURL + route, data);
    } else if (type === 'PUT') {
      return this.http.put(this.apiURL + route, data);
    } else {
      console.log('DataService: Invalid request type: ' + type);
    }
  }
}
