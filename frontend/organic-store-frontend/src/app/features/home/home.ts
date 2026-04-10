import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { Features } from './components/features/features';
import { Products } from './components/products/products';
import { Category } from './components/category/category';


@Component({
  selector: 'app-home',
  imports: [Hero, Features, Products, Category],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
