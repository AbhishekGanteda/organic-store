import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Expose current user as a BehaviorSubject so UI can react to session changes
  currentUser$ = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );

  constructor(private api: ApiService) {}

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
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser$.next(user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUser$.next(null);
  }

  setSession(data: { user: any; token: string }): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    this.currentUser$.next(data.user);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  fetchCurrentUser() {
    return this.api.get<any>('/auth/me');
  }

}