import { Injectable, signal } from '@angular/core';
import { firstValueFrom, from, Observable, switchMap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey = 'token';
  private readonly currentUserKey = 'currentUser';
  private readonly storage = localStorage;
  private loginPublicKey: string | null = null;

  currentUser = signal<any>(null);

  constructor(private api: ApiService) {
    this.restoreSession();
  }

  register(userData: any): Observable<{ user: any; token: string }> {
    return this.api.post<{ user: any; token: string }>('/auth/register', userData);
  }

  login(email: string, password: string): Observable<{ user: any; token: string }> {
    return from(this.encryptPassword(password)).pipe(
      switchMap(encryptedPassword =>
        this.api.post<{ user: any; token: string }>('/auth/login', { email, encryptedPassword })
      )
    );
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

  private async encryptPassword(password: string): Promise<string> {
    if (!globalThis.crypto?.subtle) {
      throw new Error('Secure crypto API is unavailable in this browser');
    }

    const publicKeyPem = await this.getLoginPublicKey();
    const keyData = this.pemToArrayBuffer(publicKeyPem);

    const publicKey = await globalThis.crypto.subtle.importKey(
      'spki',
      keyData,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );

    const encodedPassword = new TextEncoder().encode(password);
    const encrypted = await globalThis.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      encodedPassword
    );

    return this.arrayBufferToBase64(encrypted);
  }

  private async getLoginPublicKey(): Promise<string> {
    if (this.loginPublicKey) {
      return this.loginPublicKey;
    }

    const response = await firstValueFrom(this.api.get<{ publicKey: string }>('/auth/login-public-key'));
    if (!response?.publicKey) {
      throw new Error('Unable to fetch login public key');
    }

    this.loginPublicKey = response.publicKey;
    return this.loginPublicKey;
  }

  private pemToArrayBuffer(pem: string): ArrayBuffer {
    const base64 = pem
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\s/g, '');

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';

    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }

}