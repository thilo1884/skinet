import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  //We will do slitly differently here, we still need the basked from the API
  private basketSource = new BehaviorSubject<IBasket>(null); //-> it needs a initial value and for now we set to 0
  basket$ = this.basketSource.asObservable(); //$ to make clear is an observable

  //we create another beahvrio object
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotals$ = this.basketTotalSource.asObservable();
  shipping = 0;


  constructor(private http: HttpClient) { }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    this.calculateTotals();
  }


  getBasket(id: string) {
    return this.http.get(this.baseUrl + 'basket?id=' + id)
    .pipe(
      map((basket : IBasket) => { //we map the basket which is going to be a type of IBasket
        this.basketSource.next(basket); //at this moment in time, we are not yet subscribed to this. The next method is avaiable from BehaviorSubject
        //console.log(this.getCurrentBasketValue()); we dont neet this anymore
        this.calculateTotals();
      }) // to subscribe the obsarvable coming back from the http client, we will use the async pipe in the component, to connect to the basked observable
    );
  }

  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'basket', basket).subscribe((response: IBasket) => { //in this case we subscribe already here
      this.basketSource.next(response);                      //this will change the basketSource BehaviorSubject with the new values
      this.calculateTotals();// console.log(response) --> replaced by this.calculateTotals();
    }, error => {
      console.log(error)
    });
  }

  getCurrentBasketValue(){
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1) {//we are adding from the product component
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item,quantity); //itemToAdd is type IBasketItem, and we need a method to map basket item to product
    const basket = this.getCurrentBasketValue() ?? this.createBasket(); //?? if it`s null create a new basket
    //basket.items.push(itemToAdd) --> this does not cover the case a basket already exist and only the quantity is changed
    //also at this stage we don`t know if we have already this type of item in our basket. If we do, we just want to increase the quantity
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity); 
    //if we don`t have the item in the basket, we will push it
    //if we already have, than we will only increase the quantity
    this.setBasket(basket);
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

 decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some(x => x.id === item.id)) {
      basket.items = basket.items.filter(i => i.id !== item.id);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  //delete local basket from the redis DB, just a cleanup method
  deleteLocalBasket(id: string) {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    }, error => {
      console.log(error);
    });
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = this.shipping;
    const subtotal = basket.items.reduce((a,b) => (b.price * b.quantity) + a, 0) //a has initial value of 0
    const total = subtotal + shipping;
    this.basketTotalSource.next({shipping, total, subtotal}); //it create a new obcjet with shipping, total and subtotal
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    //console.log("my item is" + items); --> at this point items in undefined, and method findIndex does not work!
    //we need to check if the itemToAdd is already present in the basket
    const index = items.findIndex( i => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket(); //create a new empty basket with the unique string id
    localStorage.setItem('basket_id', basket.id); //localstorage persist even after the browser restarts, or pc restarts. 
                                                 // It is for a browser (chrome and firefox etc also have localstorage)
    return basket;
  }

  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    };
  }

}
