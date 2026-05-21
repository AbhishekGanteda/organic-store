import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { Toast } from '../../shared/components/toast/toast';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Toast],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {

  currentUser: any = null;

  isEditing = false;

  profileForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    address: new FormGroup({
      label: new FormControl('Home'),

      street: new FormControl(''),

      city: new FormControl(''),

      state: new FormControl(''),

      postalCode: new FormControl(''),

      country: new FormControl('')
    }),

    password: new FormControl('', [
      Validators.minLength(6)
    ]),

    confirmPassword: new FormControl('')
  });

  toastMessage = '';

  toastType: 'success' | 'error' | 'warning' = 'success';

  showToast = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {

    this.auth.currentUser$.subscribe(user => {

      this.currentUser = user;

      if (user) {

        const primaryAddress = user.addresses?.[0] || {};

        this.profileForm.patchValue({

          name: user.name,

          email: user.email,

          address: {
            label: primaryAddress.label || 'Home',

            street: primaryAddress.street || '',

            city: primaryAddress.city || '',

            state: primaryAddress.state || '',

            postalCode: primaryAddress.postalCode || '',

            country: primaryAddress.country || ''
          }
        });
      }
    });
  }

  startEditing() {
    this.isEditing = true;
  }

  cancelEditing() {

    this.isEditing = false;

    this.profileForm.patchValue({
      password: '',
      confirmPassword: ''
    });
  }

  onLogout() {

    this.auth.logout();

    this.router.navigateByUrl('/');
  }

  saveProfile() {

    if (this.profileForm.invalid) {

      this.triggerToast(
        'Please fill valid profile details.',
        'warning'
      );

      return;
    }

    const {
      name,
      email,
      address,
      password,
      confirmPassword
    } = this.profileForm.value;

    if (password && password !== confirmPassword) {

      this.triggerToast(
        'Passwords do not match.',
        'warning'
      );

      return;
    }

    const requestData: any = {
      name,
      email,

      addresses: [
        {
          label: address?.label || 'Home',
          street: address?.street || '',
          city: address?.city || '',
          state: address?.state || '',
          postalCode: address?.postalCode || '',
          country: address?.country || ''
        }
      ]
    };

    if (password) {
      requestData.password = password;
    }

    this.auth.updateProfile(requestData).subscribe({

      next: updatedUser => {

        this.auth.updateCurrentUser(updatedUser);

        this.currentUser = updatedUser;

        this.isEditing = false;

        this.triggerToast(
          'Profile updated successfully.',
          'success'
        );

        this.profileForm.patchValue({
          password: '',
          confirmPassword: ''
        });
      },

      error: () => {

        this.triggerToast(
          'Unable to update profile.',
          'error'
        );
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