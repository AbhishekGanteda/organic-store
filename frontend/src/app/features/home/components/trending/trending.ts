import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { ProductCard } from '../../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './trending.html',
  styleUrl: './trending.css',
})
export class Trending {
  trendingProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {
    this.productService.getTrendingProducts().subscribe(products => {
      this.trendingProducts = products;
      this.cdr.detectChanges();
    });
  }
}
