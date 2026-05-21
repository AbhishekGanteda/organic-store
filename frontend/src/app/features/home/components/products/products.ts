import { Component } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { ProductCard } from '../../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-products',
  imports: [ProductCard], 
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {

  products: Product[] = [];

  constructor(
    private productService: ProductService
  ) {

    this.products =
      this.productService.getAllProducts();

  }

}