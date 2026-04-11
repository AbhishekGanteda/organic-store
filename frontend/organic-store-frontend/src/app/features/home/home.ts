import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { Features } from './components/features/features';
import { Products } from './components/products/products';
import { Category } from './components/category/category';
import { Trending } from './components/trending/trending';
import { Reviews } from './components/reviews/reviews';


@Component({
  selector: 'app-home',
  imports: [Hero, Features, Products, Category, Trending, Reviews],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
