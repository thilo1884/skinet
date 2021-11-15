import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, delay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  // We inject the root, to redirect the user
  constructor(private router: Router, private toastr: ToastrService) {}

   //We want to catch any error that come back from our http response
   // next id the response coming back
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // we use the pipe to deal with observable
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          //we check the status og the httpresponse

          if (error.status === 400) {
            if (error.error.errors) {
              //we check if we have the error array
              throw error.error; //if it is a validation error we give it back to the component
            } else {
              this.toastr.error(error.error.message, error.error.statusCode)
            }
          }

          if (error.status === 401) {
            this.toastr.error(error.error.message, error.error.statusCode)
          }

          if (error.status === 404) {
            this.router.navigateByUrl('/not-found');
          }

          if (error.status === 500) {
                                                        //it creates a new object called error
            const navigationExtras: NavigationExtras = {state: {error: error.error}}
            this.router.navigateByUrl('/server-error', navigationExtras);
          }
          return throwError(error);
        }
      })
    );
  }
}
