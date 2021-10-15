import { HttpClient } from '@angular/common/http'; //manually added
import { Component, OnInit } from '@angular/core';
import { IPagination } from './shared/models/pagination';
import { IProduct } from './shared/models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Skinet'; //class property
  //products: IProduct[]; //array that take any kind of type. It was any[]

  // In the constructore is where we inject the http client into here
  // Even thought this is not best practice. It better to use an Angular Service 
  constructor(/*private http: HttpClient*/){}

   
  ngOnInit(): void {
    //here is where we call our API

    //console.log(response);

    //this returns an observable
    //this part is now handles in the service shop
    /*this.http.get('https://localhost:5001/api/products?pageSize=50').subscribe((response: IPagination) => {
      this.products = response.data;
    }, error => {
      console.log(error);
    });*/
  }
  
}
