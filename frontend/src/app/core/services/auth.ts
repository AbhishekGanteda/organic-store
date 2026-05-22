import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey = 'token';
  private readonly currentUserKey = 'currentUser';
  private readonly storage = sessionStorage;

  currentUser = signal<any>(null);

  constructor(private api: ApiService) {
    this.restoreSession();
  }

  register(userData: any): Observable<{ user: any; token: string }> {
    return this.api.post<{ user: any; token: string }>('/auth/register', userData);
  }

  login(email: string, password: string): Observable<{ user: any; token: string }> {
    return this.api.post<{ user: any; token: string }>('/auth/login', { email, password });
  }

  updateProfile(data: { name: string; email: string; password?: string }): Observable<any> {
    return this.api.put<any>('/auth/me', data);
  }

  updateCurrentUser(user: any): void {
    this.storage.setItem(this.currentUserKey, JSON.stringify(user));
    this.currentUser.set(user);
  }

  logout(): void {
    this.clearSession();
  }

  setSession(data: { user: any; token: string }): void {
    this.storage.setItem(this.tokenKey, data.token);
    this.storage.setItem(this.currentUserKey, JSON.stringify(data.user));
    this.currentUser.set(data.user);
  }

  isLoggedIn(): boolean {
    const token = this.storage.getItem(this.tokenKey);
    return !!token && !this.isTokenExpired(token);
  }

  getCurrentUser() {
    if (!this.isLoggedIn()) {
      return null;
    }

    return this.currentUser();
  }

  fetchCurrentUser() {
    return this.api.get<any>('/auth/me');
  }

  private restoreSession(): void {
    const token = this.storage.getItem(this.tokenKey);
    const currentUser = this.storage.getItem(this.currentUserKey);

    if (!token || this.isTokenExpired(token) || !currentUser) {
      this.clearSession();
      return;
    }

    try {
      this.currentUser.set(JSON.parse(currentUser));
    } catch {
      this.clearSession();
    }
  }

  private clearSession(): void {
    this.storage.removeItem(this.tokenKey);
    this.storage.removeItem(this.currentUserKey);
    this.currentUser.set(null);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return !payload?.exp || Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

}