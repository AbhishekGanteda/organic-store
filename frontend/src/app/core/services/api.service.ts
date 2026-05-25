import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  get<T>(path: string) {
    return this.http.get<T>(`${environment.apiUrl}${path}`, {
      headers: this.getHeaders(),
    });
  }

  post<T>(path: string, payload: any) {
    return this.http.post<T>(`${environment.apiUrl}${path}`, payload, {
      headers: this.getHeaders(),
    });
  }

  put<T>(path: string, payload: any) {
    return this.http.put<T>(`${environment.apiUrl}${path}`, payload, {
      headers: this.getHeaders(),
    });
  }

  delete<T>(path: string) {
    return this.http.delete<T>(`${environment.apiUrl}${path}`, {
      headers: this.getHeaders(),
    });
  }
}
