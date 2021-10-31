import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})

//in server error component we demonstrate how to pass the error state.. This is avaiable since angular 7.2
// infact when we are re-direct in server error componentm, the error state is lost.
//We can keep it by using router
export class ServerErrorComponent implements OnInit {
  error: any

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.error = navigation && navigation.extras && navigation.extras.state && navigation.extras.state.error;
    //this.error = navigation?.extras?.state?.error;
    //we want to persist this, because in server error, if you do a refresh page then the error is gone
   }

  ngOnInit(): void {
  }

}
