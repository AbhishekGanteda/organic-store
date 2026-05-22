import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { Toast } from '../../shared/components/toast/toast';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Toast],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {

  private auth = inject(AuthService);

  private router = inject(Router);

  currentUser = this.auth.currentUser;

  isEditing = signal(false);

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

  toastMessage = signal('');

  toastType = signal<'success' | 'error' | 'warning'>('success');

  showToast = signal(false);

  private readonly syncProfileForm = effect(() => {
    const user = this.currentUser();

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

  startEditing() {
    this.isEditing.set(true);
  }

  cancelEditing() {

    this.isEditing.set(false);

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

        this.currentUser.set(updatedUser);

        this.isEditing.set(false);

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

    this.toastMessage.set(message);

    this.toastType.set(type);

    this.showToast.set(true);

    setTimeout(() => {

      this.showToast.set(false);

    }, 3000);
  }
}