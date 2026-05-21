import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { Toast } from '../../shared/components/toast/toast';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule, Toast],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth implements OnInit {
  isLoginMode: boolean = true;

  toastMessage: string = '';

  toastType: 'success' | 'error' | 'warning' =
    'success';

  showToast: boolean = false;

  redirectUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirect');

    const mode = this.route.snapshot.queryParamMap.get('mode');
    if (mode === 'signin') {
      this.isLoginMode = true;
    }

    if (this.redirectUrl) {
      this.triggerToast('Please login to continue to your cart.', 'warning');
    }
  }

  showLogin() {
    this.isLoginMode = true;
  }

  showRegister() {
    this.isLoginMode = false;
  }

  loginForm = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])

  });

  registerForm = new FormGroup({

    name: new FormControl('', [
      Validators.required
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),

    confirmPassword: new FormControl('', [
      Validators.required
    ])

  });

  login() {

    if (this.loginForm.invalid) {
      return;
    }

    this.authService
      .login(
        this.loginForm.value.email!,
        this.loginForm.value.password!
      )
      .subscribe({
        next: session => {
          this.authService.setSession(session);
          this.router.navigateByUrl(this.redirectUrl || '/');
        },
        error: () => {
          this.triggerToast('Invalid credentials', 'error');
        }
      });

  }

  register() {

    if (this.registerForm.invalid) {
      return;
    }

    if (
      this.registerForm.value.password !==
      this.registerForm.value.confirmPassword
    ) {

      this.triggerToast(
        'Passwords do not match',
        'warning'
      );

      return;

    }

    this.authService
      .register({
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      })
      .subscribe({
        next: session => {
          this.authService.setSession(session);
          this.registerForm.reset();
          this.isLoginMode = true;
          this.router.navigateByUrl(this.redirectUrl || '/');
          this.triggerToast('Registration successful.', 'success');
        },
        error: () => {
          this.triggerToast('Unable to register user', 'error');
        }
      });

  }

  triggerToast(
    message: string,
    type: 'success' | 'error' | 'warning'
  ) {

    this.toastMessage = message;

    this.toastType = type;

    this.showToast = true;

    setTimeout(() => {

      this.showToast = false;

    }, 3000);

  }
}
