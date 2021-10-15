import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IType } from '../shared/models/productType';
import {map} from 'rxjs/operators';
import { ShopParams } from '../shared/models/shopParams';

// this is a decoration
@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';

  constructor(private http: HttpClient) { }

  getProducts(shopParam?: ShopParams){
    let params = new HttpParams();

    if (shopParam.brandId !== 0) {
      params = params.append('brandId', shopParam.brandId.toString());
    }

    if (shopParam.typeId !== 0) {
      params = params.append('typeId', shopParam.typeId.toString());
    }

    if (shopParam.search) {
      params = params.append('search', shopParam.search);
    }

    //if (shopParam.sort) { no more need to check it, since in the shopParams is initialized with "name"
    params = params.append('sort', shopParam.sort);
    //}
    params = params.append('pageIndex', shopParam.pageNumber.toString());
    params = params.append('pageIndex', shopParam.pageSize.toString());

    //this request will be consumed in one of the component
    //return this.http.get<IPagination>(this.baseUrl + 'products?pageSize=50');
    //the above one gives back the response body
  
    return this.http.get<IPagination>(this.baseUrl + 'products', {observe: 'response', params})
        .pipe(
          map(response => {
            return response.body;
          })
        );
    // the one aboce gives back the http response. So we need to extract the body out of the 
    // response. We need to project that in a IPagination.
    // To achieve that we use pipe, we want to pipe the response into something.
    // inside the pipe we can make use of rxjs methods
  }

  getBrands(){
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands');
  }

  getTypes(){
    return this.http.get<IType[]>(this.baseUrl + 'products/types');
  }
}
