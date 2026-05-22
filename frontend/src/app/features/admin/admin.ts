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
  isSessionReady = false;
  pendingView: AdminView | null = null;
  summary = signal<any>({});
  users = signal<any[]>([]);
  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  features = signal<any[]>([]);
  questions = signal<any[]>([]);
  reviews = signal<any[]>([]);
  orders = signal<any[]>([]);

  newCategory: any = { name: '', image: '', description: '' };
  newFeature: any = { name: '', icon: '', description: '' };
  newQuestion: any = { question: '', answer: '', isOpen: true };
  newReview: any = { name: '', image: '', review: '', rating: 5 };
  newProduct: any = { name: '', price: 0, originalPrice: 0, image: '', category: '', description: '', isSale: false, tags: '', isTrending: false, isBestSeller: false };

  statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  selectedOrderStatus: Record<string, string> = {};

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.verifyAdminSession(() => {
      this.isSessionReady = true;
      this.loadSummary();

      if (this.pendingView && this.pendingView !== 'summary') {
        const nextView = this.pendingView;
        this.pendingView = null;
        this.selectView(nextView);
      }
    });
  }

  selectView(view: AdminView) {
    this.view.set(view);

    if (!this.isSessionReady) {
      this.pendingView = view;
      return;
    }

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
      this.summary.set(summary);
    });
  }

  loadUsers() {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.getUsers().subscribe(users => {
      this.users.set(users);
    });
  }

  loadProducts() {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.getProducts().subscribe(products => {
      this.products.set(products);
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
      this.products.update(products => [product, ...products]);
      this.newProduct = { name: '', price: 0, originalPrice: 0, image: '', category: '', description: '', isSale: false, tags: '', isTrending: false, isBestSeller: false };
    });
  }

  loadCategories() {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });
  }

  loadFeatures() {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.getFeatures().subscribe(features => {
      this.features.set(features);
    });
  }

  loadQuestions() {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.getQuestions().subscribe(questions => {
      this.questions.set(questions);
    });
  }

  loadReviews() {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.getReviews().subscribe(reviews => {
      this.reviews.set(reviews);
    });
  }

  loadOrders() {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.getOrders().subscribe(orders => {
      this.orders.set(orders);
      orders.forEach(order => {
        this.selectedOrderStatus[order._id] = order.status;
      });
    });
  }

  deleteUser(id: string) {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.deleteUser(id).subscribe(() => {
      this.users.update(users => users.filter(user => user._id !== id));
    });
  }

  deleteProduct(id: string) {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.deleteProduct(id).subscribe(() => {
      this.products.update(products => products.filter(product => product._id !== id));
    });
  }

  deleteCategory(id: string) {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.deleteCategory(id).subscribe(() => {
      this.categories.update(categories => categories.filter(category => category._id !== id));
    });
  }

  addCategory() {
    if (!this.hasAdminAccess) {
      return;
    }

    if (!this.newCategory.name.trim()) return;
    this.adminService.createCategory(this.newCategory).subscribe(category => {
      this.categories.update(categories => [category, ...categories]);
      this.newCategory = { name: '', image: '', description: '' };
    });
  }

  deleteFeature(id: string) {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.deleteFeature(id).subscribe(() => {
      this.features.update(features => features.filter(feature => feature._id !== id));
    });
  }

  addFeature() {
    if (!this.hasAdminAccess) {
      return;
    }

    if (!this.newFeature.name.trim()) return;
    this.adminService.createFeature(this.newFeature).subscribe(feature => {
      this.features.update(features => [feature, ...features]);
      this.newFeature = { name: '', icon: '', description: '' };
    });
  }

  deleteQuestion(id: string) {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.deleteQuestion(id).subscribe(() => {
      this.questions.update(questions => questions.filter(question => question._id !== id));
    });
  }

  addQuestion() {
    if (!this.hasAdminAccess) {
      return;
    }

    if (!this.newQuestion.question.trim()) return;
    this.adminService.createQuestion(this.newQuestion).subscribe(question => {
      this.questions.update(questions => [question, ...questions]);
      this.newQuestion = { question: '', answer: '', isOpen: true };
    });
  }

  deleteReview(id: string) {
    if (!this.hasAdminAccess) {
      return;
    }

    this.adminService.deleteReview(id).subscribe(() => {
      this.reviews.update(reviews => reviews.filter(review => review._id !== id));
    });
  }

  addReview() {
    if (!this.hasAdminAccess) {
      return;
    }

    if (!this.newReview.name.trim() || !this.newReview.review.trim()) return;
    this.adminService.createReview(this.newReview).subscribe(review => {
      this.reviews.update(reviews => [review, ...reviews]);
      this.newReview = { name: '', image: '', review: '', rating: 5 };
    });
  }

  updateOrderStatus(orderId: string) {
    if (!this.hasAdminAccess) {
      return;
    }

    const newStatus = this.selectedOrderStatus[orderId];
    this.adminService.updateOrderStatus(orderId, { status: newStatus }).subscribe(order => {
      this.orders.update(orders => orders.map(item => (item._id === order._id ? order : item)));
      this.selectedOrderStatus[order._id] = order.status;
    }, () => {
      this.selectedOrderStatus[orderId] = this.orders().find(item => item._id === orderId)?.status || this.selectedOrderStatus[orderId];
    });
  }

  toggleUserRole(user: any) {
    if (!this.hasAdminAccess) {
      return;
    }

    const newRole = user.role === 'admin' ? 'user' : 'admin';
    this.adminService.updateUser(user._id, { role: newRole }).subscribe(updated => {
      const updatedId = updated?._id ?? updated?.id;
      this.users.update(users => users.map(u => (u._id === updatedId ? { ...u, ...updated, _id: updatedId } : u)));
    });
  }
}
