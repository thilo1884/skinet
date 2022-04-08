import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [{provide: CdkStepper, useExisting: StepperComponent}] //add the providers for cdkStepper
})
//we extend cdkStepper such that we can have access to the cdk stepper functionality
export class StepperComponent extends CdkStepper implements OnInit {
  //create an input property. This is used to check if linear mode is selected, that we want to receive from the client
  @Input() linearModeSelected: boolean;

  ngOnInit(): void {
    this.linear = this.linearModeSelected;
  }

  onClick(index: number) {
    this.selectedIndex = index; //to keep track of which step we are
    console.log(this.selectedIndex);
  }

}
