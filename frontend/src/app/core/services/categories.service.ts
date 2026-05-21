import { Injectable } from '@angular/core';

import categoriesData from '../data/categories.json';

import { Category } from '../models/categories.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: Category[] = categoriesData;

  getAllCategories(): Category[] {
    return this.categories;
  }

}