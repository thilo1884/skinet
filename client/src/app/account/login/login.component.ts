import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup; // property
  returnUrl: string; //the url in case we are not logged in or logged in

  constructor(private accountService: AccountService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //We cannot get the queryParameter from router, thst is why we need to inject also activatedRoute
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/shop' //or if we dont have a url, go back to the shop
    this.createLoginForm()
  }

  createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),   //first parameter is the initial state. Angular froms come with embedded validator
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);
    this.accountService.login(this.loginForm.value).subscribe(() =>{
      console.log('user logged in'); //the login method resurn if successfully logged in
      //this.router.navigateByUrl('/shop');
      this.router.navigateByUrl(this.returnUrl);
    }, error => {
      console.log(error);
    });
  }

}
