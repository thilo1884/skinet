import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup;

  //in order to get the basked id, we need to inject BasketService
  constructor(private basketService: BasketService, 
              private checkoutService: CheckoutService, 
              private toastr: ToastrService,
              private router: Router) { }

  ngOnInit(): void {
  }

  submitOrder(){
    const basket = this.basketService.getCurrentBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);
    console.log("DEBUG submit order");
    this.checkoutService.createOrder(orderToCreate).subscribe((order: IOrder) => {
      this.toastr.success('Order created successfully');
      this.basketService.deleteLocalBasket(basket.id);
      //Because we get back our order from the API, we can pass order to the checkout-success page
      //such that we can re-use the id of the order to make show the details of that order
      const navigationExtras: NavigationExtras = {state: order};
      this.router.navigate(['checkout/success'], navigationExtras);
      console.log("DEBUG order received is");
      console.log(order);
    }, error => {
      this.toastr.error(error.message);
      console.log(error);
    });
  }

  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value, //+ to convert it in a number
      shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }

}
