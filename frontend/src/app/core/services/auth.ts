import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  register(userData: any) {

    const users =
      JSON.parse(localStorage.getItem('users') || '[]');

    const userExists =
      users.find(
        (user: any) => user.email === userData.email
      );

    if (userExists) {
      return false;
    }

    users.push(userData);

    localStorage.setItem(
      'users',
      JSON.stringify(users)
    );

    return true;

  }

  login(email: string, password: string) {

    const users =
      JSON.parse(localStorage.getItem('users') || '[]');

    const user =
      users.find(
        (u: any) =>
          u.email === email &&
          u.password === password
      );

    if (user) {

      localStorage.setItem(
        'currentUser',
        JSON.stringify(user)
      );

      return true;

    }

    return false;

  }

  logout() {

    localStorage.removeItem('currentUser');

  }

  isLoggedIn(): boolean {

    return !!localStorage.getItem('currentUser');

  }

  getCurrentUser() {

    return JSON.parse(
      localStorage.getItem('currentUser') || 'null'
    );

  }

}