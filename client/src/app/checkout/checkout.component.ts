import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;

  //inject the formBuilder
  //and inject AccountService used to get/post the address
  constructor(private fb: FormBuilder, private accountService: AccountService) { }

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressformValues();
  }

  //we will have a form group in a form group (in fact 3 forms). We can access each form individually
  // structure creator for the form
  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipCode: [null, null],
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required],
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required],
      })
    });
  }

  getAddressformValues(){
    this.accountService.getUserAddress().subscribe(address => {
      if (address) {
        this.checkoutForm.get('addressForm').patchValue(address); //in Angular is just so easy to populate the form
        this.checkoutForm.get('addressForm.zipCode').patchValue(address.zipCode);
      }
    }, error => {
      console.log(error);
    });
  }

}
