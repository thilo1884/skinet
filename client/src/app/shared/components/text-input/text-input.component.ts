import { Component, ElementRef, Input, OnInit, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', {static: true}) input: ElementRef;
  @Input() type = 'text';
  @Input() label: string;

  //We get the validation also from ControlValueAccessor, but in order to apply the validation
  //we need to be able to access the control itself. The way to achieve that is to inject it in the constructor
  //We set public because we need to access that also from the html
  //NgControl is what our form derive from
  //decoretor @Self, we can say that is injecting itself
  constructor(@Self() public controlDir: NgControl) {
    //controlDirective
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    const control = this.controlDir.control; //now we have access to what validation has been configurated
    const validator = control.validator ? [control.validator] : []; //if we don`t have we set an empty array
    const asyncValidators = control.asyncValidator ? [control.asyncValidator] : []//this is go after an API and check after that. 

    control.setValidators(validator);
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();
  }

  onChange(event) {}

  onTouched() {}

  writeValue(obj: any): void {
    this.input.nativeElement.value = obj || '';
  }
  registerOnChange(fn: any): void { //fn is function that we get back from the ControlValueAccessor
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
