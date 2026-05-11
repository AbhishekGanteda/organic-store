import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { Toast } from '../../shared/components/toast/toast';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule, Toast],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  isLoginMode: boolean = true;

  toastMessage: string = '';

  toastType: 'success' | 'error' | 'warning' =
    'success';

  showToast: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

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

    const success =
      this.authService.login(
        this.loginForm.value.email!,
        this.loginForm.value.password!
      );

    if (success) {

      this.router.navigate(['/']);

    }

    else {

      this.triggerToast(
        'Invalid credentials',
        'error'
      );

    }

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

    const success =
      this.authService.register({
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      });

    if (success) {

      this.registerForm.reset();

      this.isLoginMode = true;

    }

    else {

      this.triggerToast(
        'User already exists',
        'error'
      );

    }

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
