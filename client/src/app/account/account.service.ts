import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  // we create an obsavable for the the user, To check if we have already a token and so on (we did already that for the basket)
  //private currentUserSource = new BehaviorSubject<IUser>(null); //-> we give a inital value of null

  //BehaviorSubject<IUser>(null) did not work out well with the auth guard because it return immeduately null 
  // but the the auth guard would kick us out. 
  // ReplaySubject<IUser>(1) it does not emmit an initial value so auth guard will wait until ReplaySubject has something before continue

  private currentUserSource = new ReplaySubject<IUser>(1); //it holds and cash one user
  currentUser$ = this.currentUserSource.asObservable(); //this is an obsarvable

  //we need access to the http server, so we will inject this
  //We will get back the usre (displayname and email) and the token. And we want to persist the token on localstore
  constructor(private http: HttpClient, private router: Router) { }

  loadCurrentUser(token: string) {
    if (token === null) {
      this.currentUserSource.next(null);
      return of(null); //return an empty observable
    }

    //As we have seen in postman in the hearder we have to add the token
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(this.baseUrl + 'account', {headers}).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  login(values: any){
    return this.http.post(this.baseUrl + 'account/login', values).pipe(
      map((user: IUser) => {  //the answer coming from the API (is in the pipe) we project it in the currentUserSource
        if (user) {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user); //we store the user in currentUserSource 
        }
      })
    );
  }


  register(values: any) {
    return this.http.post(this.baseUrl + 'account/register', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  logout(){
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/')
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

}
