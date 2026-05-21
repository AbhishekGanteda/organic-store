import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth';

export type AdminView =
  | 'summary'
  | 'users'
  | 'products'
  | 'categories'
  | 'features'
  | 'questions'
  | 'reviews'
  | 'orders';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  view = signal<AdminView>('summary');
  hasAdminAccess = false;
  summary: any = {};
  users: any[] = [];
  products: any[] = [];
  categories: any[] = [];
  features: any[] = [];
  questions: any[] = [];
  reviews: any[] = [];
  orders: any[] = [];

  newCategory: any = { name: '', image: '', description: '' };
  newFeature: any = { name: '', icon: '', description: '' };
  newQuestion: any = { question: '', answer: '', isOpen: true };
  newReview: any = { name: '', image: '', review: '', rating: 5 };
  newProduct: any = { name: '', price: 0, originalPrice: 0, image: '', category: '', description: '', isSale: false, tags: '', isTrending: false, isBestSeller: false };

  statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  selectedOrderStatus: Record<string, string> = {};

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.verifyAdminSession(() => {
      this.loadSummary();
    });
  }

  selectView(view: AdminView) {
    this.view.set(view);

    if (!this.hasAdminAccess) {
      return;
    }

    switch (view) {
      case 'summary':
        this.loadSummary();
        break;
      case 'users':
        this.loadUsers();
        break;
      case 'products':
          this.loadProducts();
          this.loadCategories();
        break;
      case 'categories':
        this.loadCategories();
        break;
      case 'features':
        this.loadFeatures();
        break;
      case 'questions':
        this.loadQuestions();
        break;
      case 'reviews':
        this.loadReviews();
        break;
      case 'orders':
        this.loadOrders();
        break;
    }
  }

  private verifyAdminSession(onSuccess: () => void) {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.authService.fetchCurrentUser().subscribe({
      next: user => {
        this.hasAdminAccess = user?.role === 'admin';

        if (this.hasAdminAccess) {
          onSuccess();
          return;
        }

        this.authService.logout();
      },
      error: () => {
        this.hasAdminAccess = false;
        this.authService.logout();
      },
    });
  }

  loadSummary() {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.getSummary().subscribe(summary => {
      this.summary = summary;
    });
  }

  loadUsers() {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  loadProducts() {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  createProduct() {
    if (!this.newProduct.name.trim()) return;

    // prepare tags array
    const payload = { ...this.newProduct };
    if (typeof payload.tags === 'string') {
      payload.tags = payload.tags
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0);
    }

    this.adminService.createProduct(payload).subscribe(product => {
      this.products = [product, ...this.products];
      this.newProduct = { name: '', price: 0, originalPrice: 0, image: '', category: '', description: '', isSale: false, tags: '', isTrending: false, isBestSeller: false };
    });
  }

  loadCategories() {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadFeatures() {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.getFeatures().subscribe(features => {
      this.features = features;
    });
  }

  loadQuestions() {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.getQuestions().subscribe(questions => {
      this.questions = questions;
    });
  }

  loadReviews() {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.getReviews().subscribe(reviews => {
      this.reviews = reviews;
    });
  }

  loadOrders() {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.getOrders().subscribe(orders => {
      this.orders = orders;
      this.orders.forEach(order => {
        this.selectedOrderStatus[order._id] = order.status;
      });
    });
  }

  deleteUser(id: string) {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(user => user._id !== id);
    });
  }

  deleteProduct(id: string) {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.deleteProduct(id).subscribe(() => {
      this.products = this.products.filter(product => product._id !== id);
    });
  }

  deleteCategory(id: string) {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.deleteCategory(id).subscribe(() => {
      this.categories = this.categories.filter(category => category._id !== id);
    });
  }

  addCategory() {
    if (!this.hasAdminAccess) {
      return;
    }

    if (!this.newCategory.name.trim()) return;
    this.adminService.createCategory(this.newCategory).subscribe(category => {
      this.categories = [category, ...this.categories];
      this.newCategory = { name: '', image: '', description: '' };
    });
  }

  deleteFeature(id: string) {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.deleteFeature(id).subscribe(() => {
      this.features = this.features.filter(feature => feature._id !== id);
    });
  }

  addFeature() {
    if (!this.hasAdminAccess) {
      return;
    }

    if (!this.newFeature.name.trim()) return;
    this.adminService.createFeature(this.newFeature).subscribe(feature => {
      this.features = [feature, ...this.features];
      this.newFeature = { name: '', icon: '', description: '' };
    });
  }

  deleteQuestion(id: string) {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.deleteQuestion(id).subscribe(() => {
      this.questions = this.questions.filter(question => question._id !== id);
    });
  }

  addQuestion() {
    if (!this.hasAdminAccess) {
      return;
    }

    if (!this.newQuestion.question.trim()) return;
    this.adminService.createQuestion(this.newQuestion).subscribe(question => {
      this.questions = [question, ...this.questions];
      this.newQuestion = { question: '', answer: '', isOpen: true };
    });
  }

  deleteReview(id: string) {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.deleteReview(id).subscribe(() => {
      this.reviews = this.reviews.filter(review => review._id !== id);
    });
  }

  addReview() {
    if (!this.hasAdminAccess) {
      return;
    }

    if (!this.newReview.name.trim() || !this.newReview.review.trim()) return;
    this.adminService.createReview(this.newReview).subscribe(review => {
      this.reviews = [review, ...this.reviews];
      this.newReview = { name: '', image: '', review: '', rating: 5 };
    });
  }

  updateOrderStatus(orderId: string) {
    if (!this.hasAdminAccess) {
      return;
    }

    const newStatus = this.selectedOrderStatus[orderId];
    this.adminService.updateOrderStatus(orderId, { status: newStatus }).subscribe(order => {
      this.orders = this.orders.map(item => (item._id === order._id ? order : item));
    });
  }

  toggleUserRole(user: any) {
    if (!this.hasAdminAccess) {
      return;
    }

    const newRole = user.role === 'admin' ? 'user' : 'admin';
    this.adminService.updateUser(user._id, { role: newRole }).subscribe(updated => {
      this.users = this.users.map(u => (u._id === updated._id ? updated : u));
    });
  }
}
