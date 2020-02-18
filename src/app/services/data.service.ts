import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Rank} from '../interfaces/rank';
import {Tag} from '../interfaces/tag';
import {User} from '../classes/user';
import {Deposit} from '../classes/deposit';
import {Refund} from '../classes/refund';
import {Purchase} from '../classes/purchase';
import {Product} from '../classes/product';
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
      return plainToClass(User, <any[]>result);
    }));
  }

  public getUser(id: number): Observable<User> {
    return this.getData('users/' + id.toString()).pipe(map((result: any) => {
      return plainToClass(User, result);
    }));
  }

  public getProducts(): Observable<Product[]> {
    return this.getData('products').pipe(map(result => {
      return plainToClass(Product, <any[]>result);
    }));
  }

  public getPurchases(params?: HttpParams): Observable<Purchase[]> {
    return this.getData('purchases', params).pipe(map(result => {
      return plainToClass(Purchase, <any[]>result);
    }));
  }

  public getFavorites(id: number): Observable<number[]> {
    return this.getData('users/' + String(id) + '/favorites').pipe(map(result => {
      return <number[]>result;
    }));
  }

  public getRanks(): Observable<Rank[]> {
    return this.getData('ranks').pipe(map(result => {
      return <Rank[]>result;
    }));
  }

  public getTags(): Observable<Tag[]> {
    return this.getData('tags').pipe(map(result => {
      return <Tag[]>result;
    }));
  }

  public getUserPurchases(id: number): Observable<Purchase[]> {
    return this.getData('users/' + String(id) + '/purchases').pipe(map((result: any) => {
      return plainToClass(Purchase, <any[]>result);
    }));
  }

  public getUserDeposits(id: number): Observable<Deposit[]> {
    return this.getData('users/' + String(id) + '/deposits').pipe(map((result: any) => {
      return plainToClass(Deposit, <any[]>result);
    }));
  }

  public getUserRefunds(id: number): Observable<Refund[]> {
    return this.getData('users/' + String(id) + '/refunds').pipe(map((result: any) => {
      return plainToClass(Refund, <any[]>result);
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

  private getData(route: string, params?: HttpParams) {
    return this.makeRequest(route, null, 'GET', params);
  }

  private postData(route, data, params?: HttpParams) {
    return this.makeRequest(route, data, 'POST', params);
  }

  private putData(route, data, params?: HttpParams) {
    return this.makeRequest(route, data, 'PUT', params);
  }

  private makeRequest(route: string, data: any, type: string, params?: HttpParams) {
    /**
     * Check if the backend is available. If this is not the case,
     * the HTTP_INTERCEPTOR will redirect you to the offline page
     * and cancel the request.
     */
    this.http.get(this.apiURL);

    /**
     * URL parameters.
     */
    if (!params) {
      params = new HttpParams();
    }

    /** Switch case for the different request methods. */
    if (type === 'GET') {
      return this.http.get(this.apiURL + route, {params: params});
    } else if (type === 'POST') {
      return this.http.post(this.apiURL + route, data, {params: params});
    } else if (type === 'PUT') {
      return this.http.put(this.apiURL + route, data, {params: params});
    } else {
      console.log('DataService: Invalid request type: ' + type);
    }
  }
}
