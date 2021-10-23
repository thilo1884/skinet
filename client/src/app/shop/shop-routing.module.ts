import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

//dealing with the lazyload pattern
const routes: Routes = [
  {path: '', component: ShopComponent},
  {path: ':id', component: ProductDetailsComponent},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes) //iso forRoot, we use forChild, this means routes are not avaiable in the app module, but in the shop module
  ],
  //we need to export this to have it avaiable in shop module
  exports: [RouterModule]
})
export class ShopRoutingModule { }
