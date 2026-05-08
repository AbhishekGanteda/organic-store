import { Component } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trending',
  imports: [RouterLink],
  templateUrl: './trending.html',
  styleUrl: './trending.css',
})
export class Trending {
  trendingProducts: Product[] = [];

  constructor(
    private productService: ProductService
  ) {

    this.trendingProducts =
      this.productService.getTrendingProducts();

  }
}
