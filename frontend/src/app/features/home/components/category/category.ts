import { ChangeDetectorRef, Component } from '@angular/core';
import { Category } from '../../../../core/models/categories.model';
import { CategoryService } from '../../../../core/services/categories.service';
import { CategoriesCard } from '../../../../shared/components/categories-card/categories-card';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CategoriesCard],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Categories {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      this.cdr.detectChanges();
    });
  }
}
