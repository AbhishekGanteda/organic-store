import { Injectable } from '@angular/core';

import productsData from '../data/products.json';

import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Product[] = productsData;

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {

    return this.products.find(
      product => product.id === id
    );

  }

  getTrendingProducts(): Product[] {

    return this.products.filter(
      product => product.isTrending
    );

  }

}