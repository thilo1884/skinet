import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;

  //it`s injected with shopService
  constructor(private shopSerive: ShopService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService) {
    this.bcService.set('@productDetails',' '); //solve issue when loading a product page (with delay) where the was shown
                                               //the product number. this now needs to be an empty space rather than an
                                              // empty string for this to have an effect.
   }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    //the + is to casting the string id to a number
    this.shopSerive.getProduct(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe(product => {
      this.product = product;
      this.bcService.set('@productDetails', product.name)
    }, error => {
      console.log(error);
    })
  }

}
