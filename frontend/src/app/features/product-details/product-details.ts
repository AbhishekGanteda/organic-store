import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {

  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  quantity = signal(1);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!id) {
        return;
      }

      this.quantity.set(1);
      this.product.set(null);
      this.relatedProducts.set([]);

      this.productService.getProductById(id).subscribe(product => {
        this.product.set(product);

        this.productService.getRelatedProducts(product.category, id).subscribe(products => {
          this.relatedProducts.set(products.filter(p => p.id !== id).slice(0, 3));
          this.cdr.detectChanges();
        });

        this.cdr.detectChanges();
      });
    });
  }

  increaseQuantity() {
    this.quantity.update(quantity => quantity + 1);
  }

  decreaseQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update(quantity => quantity - 1);
    }
  }

  addToCart() {
    const product = this.product();
    if (!product) {
      return;
    }

    this.cartService.addToCart(product.id, this.quantity()).subscribe({
      next: () => {
        this.quantity.set(1);
      },
    });
  }

}