import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  //this allow to accept a property from a parent component
  // The parents component is in this case shop.component
  // in shop-component.html is what we pass down here [product]="item"
  @Input() product: IProduct;

  constructor() { }

  ngOnInit(): void {
  }

}
