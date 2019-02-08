import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../interfaces/user';
import {Observable} from 'rxjs';
import {Product} from '../interfaces/product';
import {map} from 'rxjs/operators';
import {Rank} from '../interfaces/rank';
import {Tag} from '../interfaces/tag';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    public http: HttpClient
  ) { }

  public getUsers(): Observable<User[]> {
    return this.getData('users').pipe(map(result => {
      return result['users'];
    }));
  }

  public getUser(id: number): Observable<User> {
    return this.getData('users/' + id.toString()).pipe(map(result => {
      return result['user'];
    }));
  }

  public getProducts(): Observable<Product[]> {
    return this.getData('products').pipe(map(result => {
      return result['products'];
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

  public createPurchase(data) {
    return this.postData('purchases', data);
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
    this.http.get('/api/');

    /** Switch case for the different request methods. */
    if (type === 'GET') {
      return this.http.get('/api/' + route);
    } else if (type === 'POST') {
      return this.http.post('/api/' + route, data);
    } else if (type === 'PUT') {
      return this.http.put('/api/' + route, data);
    } else {
      console.log('DataService: Invalid request type: ' + type);
    }
  }
}
