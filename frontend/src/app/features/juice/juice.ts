import { ChangeDetectorRef, Component } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-juice',
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './juice.html',
  styleUrl: './juice.css',
})

export class Juice {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  saleProducts: Product[] = [];
  searchText: string = '';
  
  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {
    this.productService.getProductsByCategory('Juice').subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
      this.cdr.detectChanges();
    });

    this.productService.getSaleProducts().subscribe(products => {
      this.saleProducts = products.filter(product => product.category === 'Juice');
      this.cdr.detectChanges();
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesSearch;
    });
  }

  sortProducts(event: Event) {
    const sortBy = (event.target as HTMLSelectElement).value;

    if (sortBy === 'price') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'popularity') {
      this.filteredProducts.sort((a, b) => b.rating - a.rating);
    } else {
      this.filteredProducts = [...this.products];
      this.filterProducts();
    }
  }
}
