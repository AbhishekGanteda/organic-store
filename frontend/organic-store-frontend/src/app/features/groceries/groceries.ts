import { Component } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-groceries',
  imports: [CommonModule, FormsModule],
  templateUrl: './groceries.html',
  styleUrl: './groceries.css',
})
export class Groceries {
  products: Product[] = [];
  
    filteredProducts: Product[] = [];
  
    saleProducts: Product[] = [];
  
    searchText: string = '';
    
    constructor(
      private productService: ProductService
    ) {
  
      this.products =
        this.productService.getAllProducts()
        .filter(product => product.category === 'Groceries');
  
      this.filteredProducts =
        this.products;
  
      this.saleProducts =
        this.productService.getSaleProducts();
  
    }
  
    filterProducts() {
  
      this.filteredProducts =
        this.products.filter(product => {
  
          const matchesSearch =
            product.name
              .toLowerCase()
              .includes(
                this.searchText.toLowerCase()
              );
  
          return matchesSearch;
  
        });
  
    }
  
    sortProducts(event: Event) {
  
      const sortBy =
        (event.target as HTMLSelectElement).value;
  
      if (sortBy === 'price') {
  
        this.filteredProducts.sort(
          (a, b) => a.price - b.price
        );
  
      }
  
      else if (sortBy === 'popularity') {
  
        this.filteredProducts.sort(
          (a, b) => b.rating - a.rating
        );
  
      }
  
      else {
  
        this.filteredProducts =
          [...this.products];
        this.filterProducts();
  
      }
  
    }
}
