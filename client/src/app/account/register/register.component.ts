import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errors: string[];

  //in this case we inject the FormBuilder, just little bit different as done in login.component
  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm(){
    this.registerForm = this.fb.group({ //same as doing new FormGroup({ (as in login.component)
        displayName: [null, [Validators.required]],
        email: [null, 
          [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')], //syncronus validators
          [this.validateEmailNotTaken()] //Async validator (if the above one pass, that the async validator is checked)
        ], //after we type the charachter in the mail. it waits 500ms before checkt it against our API
        password: [null, [Validators.required]]
      });
  }

  onSubmit() {
    console.log(this.registerForm.value)
    this.accountService.register(this.registerForm.value).subscribe(response => {
        this.router.navigateByUrl('/shop');
   }, error => {
     console.log(error);
     this.errors = error.errors; //then is avaible and can use in the template
   });
  }

  validateEmailNotTaken(): AsyncValidatorFn { //it keep chekcing to the API if the email is taken, but with a small delay
    return control => { //external observable (control is AbstracControl, that ControlValueAccessor derive from)
      return timer(500).pipe( //return a internal observable
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.accountService.checkEmailExists(control.value).pipe( //control.value, is in this case our mail
            map(res => {
              return res ? {emailExists: true} : null;//emailExists is a mark that we create, as one of the Validators.required or pattern one
            })
          );
        })
      );
    };
  }

}
