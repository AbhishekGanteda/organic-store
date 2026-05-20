import { Component } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { RouterLink } from '@angular/router';
import { ProductCard } from '../../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-trending',
  imports: [RouterLink, ProductCard],
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
