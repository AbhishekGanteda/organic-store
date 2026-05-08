import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-everything',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './everything.html',
  styleUrl: './everything.css',
})
export class Everything {

  products: Product[] = [];

  filteredProducts: Product[] = [];

  saleProducts: Product[] = [];

  searchText: string = '';

  selectedCategory: string = 'All';

  constructor(
    private productService: ProductService
  ) {

    this.products =
      this.productService.getAllProducts();

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

        const matchesCategory =
          this.selectedCategory === 'All'
          ||
          product.category === this.selectedCategory;

        return matchesSearch && matchesCategory;

      });

  }

  selectCategory(category: string) {

    this.selectedCategory = category;

    this.filterProducts();

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