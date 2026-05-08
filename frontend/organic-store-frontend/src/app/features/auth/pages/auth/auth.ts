import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  isLoginMode: boolean = true;

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
}
