import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {SnackbarService} from '../snackbar/snackbar.service';
import {Router} from '@angular/router';

/** This array contains all routes from which you will be redirected to the login page
 * if the backend is normally reachable again.
 */
const redirectLoginCases: String[] = ['/offline', '/maintenance'];

@Injectable()
export class InterceptorComponent implements HttpInterceptor {
  constructor(
    private snackbar: SnackbarService,
    private router: Router
  ) {
  }

  /** Intercept all HTTP requests. Open a snackbar on success or error.*/
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          /** If we are on a page that was caused by a previous redirection (offline, maintenance, ...)
           *  and the backend is now normally accessible again, we redirect to the login page again.
           */
          if (redirectLoginCases.includes(this.router.url)) {
            this.router.navigate(['/']);
          }
          /** Only those answers are to be opened as snackbar which also
           have a message in their body. */
          if (event.body.hasOwnProperty('message')) {
            const message = event['body']['message'];
            if (message !== 'Backend is online.') {
              this.snackbar.openSnackBar(message);
            }
          }
        }
      }, error => {
        /** If the backend is not available, you should redirect
         to the corresponding page. */
        if (error.status === 504) {
          this.router.navigate(['/offline']);
        } else if (error.status === 503) {
          this.router.navigate(['/maintenance']);
        } else {
          this.snackbar.openSnackBar(error['error']['message']);
          this.router.navigate(['/']);
        }
      })
    );
  };
}

