import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    public http: HttpClient
  ) { }

  public getUsers() {
    return this.getData('users');
  }

  public getRanks() {
    return this.getData('ranks');
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
