import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private api: ApiService) {}

  getSummary(): Observable<any> {
    return this.api.get<any>('/admin/summary').pipe(
      map(summary => ({
        users: summary.totalUsers ?? 0,
        orders: summary.totalOrders ?? 0,
        products: summary.totalProducts ?? 0,
        categories: summary.totalCategories ?? 0,
        features: summary.totalFeatures ?? 0,
        questions: summary.totalQuestions ?? 0,
        reviews: summary.totalReviews ?? 0,
        revenue: summary.totalRevenue ?? 0,
        ordersByStatus: summary.ordersByStatus ?? {},
      }))
    );
  }

  getUsers(): Observable<any[]> {
    return this.api.get('/users');
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.api.put(`/users/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.api.delete(`/users/${id}`);
  }

  getProducts(): Observable<any[]> {
    return this.api.get<{ products?: any[] } | any[]>('/products').pipe(
      map(response => Array.isArray(response) ? response : response.products ?? [])
    );
  }

  createProduct(data: any): Observable<any> {
    return this.api.post('/products', data);
  }

  deleteProduct(id: string): Observable<any> {
    return this.api.delete(`/products/${id}`);
  }

  getCategories(): Observable<any[]> {
    return this.api.get('/categories');
  }

  createCategory(data: any): Observable<any> {
    return this.api.post('/categories', data);
  }

  deleteCategory(id: string): Observable<any> {
    return this.api.delete(`/categories/${id}`);
  }

  getFeatures(): Observable<any[]> {
    return this.api.get('/features');
  }

  createFeature(data: any): Observable<any> {
    return this.api.post('/features', data);
  }

  deleteFeature(id: string): Observable<any> {
    return this.api.delete(`/features/${id}`);
  }

  getQuestions(): Observable<any[]> {
    return this.api.get('/questions');
  }

  createQuestion(data: any): Observable<any> {
    return this.api.post('/questions', data);
  }

  deleteQuestion(id: string): Observable<any> {
    return this.api.delete(`/questions/${id}`);
  }

  getReviews(): Observable<any[]> {
    return this.api.get('/reviews');
  }

  createReview(data: any): Observable<any> {
    return this.api.post('/reviews', data);
  }

  deleteReview(id: string): Observable<any> {
    return this.api.delete(`/reviews/${id}`);
  }

  getOrders(): Observable<any[]> {
    return this.api.get('/orders');
  }

  updateOrderStatus(id: string, data: any): Observable<any> {
    return this.api.put(`/orders/${id}`, data);
  }
}
