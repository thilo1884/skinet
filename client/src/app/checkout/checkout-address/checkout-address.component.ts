import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})

//Parents component is checkout.component. There we have crated the structure for the form
//in html we pass the from from parent to child
// <app-checkout-address [checkoutForm]="checkoutForm"></app-checkout-address>
export class CheckoutAddressComponent implements OnInit {
  @Input() checkoutForm: FormGroup //input property

  //bring in the accountService to update the address
  //and also ToastService that give the notification that is correctly saved
  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  saveUserAddress(){
    this.accountService.updateUserAddress(this.checkoutForm.get('addressForm').value).subscribe(() =>{
      this.toastr.success('Address saved');
    }, error => {
      this.toastr.error(error.message);
      console.log(error);
    });
  }

}
