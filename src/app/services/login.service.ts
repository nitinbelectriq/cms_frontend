import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}`;
  private userId: number | null = null;

  constructor(private http: HttpClient) {}

  // 🔐 Login method with token + userId persistence
  login(credentials: { user_name: string; password: string; project_code: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        const id = response?.id;
        const token = response?.token;

        if (id) {
          this.userId = id;
          localStorage.setItem('user_id', id.toString());
        }

        if (token) {
          localStorage.setItem('auth_token', token);
        }
      })
    );
  }

  // ✅ Get token
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // ✅ Get user ID
  getUserId(): number | null {
    return this.userId || Number(localStorage.getItem('user_id'));
  }

  // ✅ Check login status
  isLoggedIn(): boolean {
    return !!this.getAuthToken(); // true if token exists
  }

  // ✅ Logout
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    this.userId = null;
  }
}
