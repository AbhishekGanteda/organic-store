import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private api: ApiService) {}

  getAllProducts(search = '', category = 'All', sort = ''): Observable<Product[]> {
    const queryParams = [];
    if (category && category !== 'All') {
      queryParams.push(`category=${encodeURIComponent(category)}`);
    }
    if (search) {
      queryParams.push(`search=${encodeURIComponent(search)}`);
    }
    if (sort) {
      queryParams.push(`sort=${encodeURIComponent(sort)}`);
    }
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    return this.api
      .get<{ products: Product[] }>(`/products${queryString}`)
      .pipe(map(response => response.products));
  }

  getProductById(id: number): Observable<Product> {
    return this.api.get<Product>(`/products/${id}`);
  }

  getTrendingProducts(): Observable<Product[]> {
    return this.api
      .get<{ products: Product[] }>(`/products?trending=true&limit=8`)
      .pipe(map(response => response.products));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.api
      .get<{ products: Product[] }>(`/products?category=${encodeURIComponent(category)}`)
      .pipe(map(response => response.products));
  }

  getSaleProducts(): Observable<Product[]> {
    return this.api
      .get<{ products: Product[] }>(`/products?sale=true&limit=8`)
      .pipe(map(response => response.products));
  }

  getRelatedProducts(category: string, currentId: number): Observable<Product[]> {
    return this.api
      .get<{ products: Product[] }>(`/products?category=${encodeURIComponent(category)}&limit=8`)
      .pipe(map(response => response.products));
  }

}