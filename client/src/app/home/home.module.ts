import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule //import the sharemodule, that has ngx-bootstrap/carousel
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
