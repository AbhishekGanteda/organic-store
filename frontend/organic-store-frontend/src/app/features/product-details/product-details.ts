import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {

  product!: Product;

  relatedProducts: Product[] = [];

  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {

    const id =
      Number(this.route.snapshot.paramMap.get('id'));

    this.product =
      this.productService.getProductById(id);

    this.relatedProducts =
      this.productService.getRelatedProducts(
        this.product.category,
        id
      );

  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {

    if (this.quantity > 1) {
      this.quantity--;
    }

  }

}