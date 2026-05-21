import { Component, Input } from '@angular/core';
import { Category } from '../../../core/models/categories.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories-card.html',
  styleUrl: './categories-card.css',
})
export class CategoriesCard {

  @Input() category!: Category

}
