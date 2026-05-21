import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Category } from '../models/categories.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private api: ApiService) {}

  getAllCategories(): Observable<Category[]> {
    return this.api
      .get<{ categories?: Category[] } | Category[]>('/categories')
      .pipe(map(response => Array.isArray(response) ? response : response.categories ?? []));
  }

}