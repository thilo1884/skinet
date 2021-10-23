import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { SharedModule } from '../shared/shared.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ShopRoutingModule } from './shop-routing.module';



@NgModule({
  declarations: [
    ShopComponent,
    ProductItemComponent,
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    //RouterModule --> no needed anymore, after the lazyloading pattern
    ShopRoutingModule
  ]
  //exports: [ShopComponent] is the shopcomponent responsble to export it (after the lazyloading pattern), no more the app module
})
export class ShopModule { }
