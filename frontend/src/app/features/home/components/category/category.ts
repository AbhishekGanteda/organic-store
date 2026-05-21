import { Component } from '@angular/core';
import { Category } from '../../../../core/models/categories.model';
import { CategoryService } from '../../../../core/services/categories.service';
import { CategoriesCard } from '../../../../shared/components/categories-card/categories-card';

@Component({
  selector: 'app-category',
  imports: [CategoriesCard],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Categories {
  categories: Category[] = [];
  constructor(private categoryService: CategoryService) {
    this.categories = this.categoryService.getAllCategories();
  }
}
