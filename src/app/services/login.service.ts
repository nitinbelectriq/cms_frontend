import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}`;
  private userId: number | null = null;
  private projectId: number | null = null;

  constructor(private http: HttpClient) {}

  // 🔐 Login method with token + userId + projectId persistence
 login(credentials: { user_name: string; password: string; project_code: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
    tap((response: any) => {
      console.log('Login response:', response);

      const id = response?.id;
      const token = response?.token;
      const project_id = response?.project_id;

      if (id) {
        this.userId = id;
        localStorage.setItem('user_id', id.toString());
      }

      if (token) {
        localStorage.setItem('auth_token', token);
      }

      if (project_id) {
        this.projectId = project_id;
        localStorage.setItem('project_id', project_id.toString());
      }
    })
  );
}

  // ✅ Get auth token
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // ✅ Get user ID
  getUserId(): number | null {
    return this.userId || Number(localStorage.getItem('user_id'));
  }

  // ✅ Get project ID
getProjectId(): number | null {
  const fromVar = this.projectId;
  const fromStorage = Number(localStorage.getItem('project_id'));

  console.log('getProjectId() fromVar:', fromVar, ' fromStorage:', fromStorage);

  return fromVar || fromStorage;
}


  // ✅ Check if logged in
  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

  // ✅ Logout clears all stored auth data
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('project_id');  // Clear project_id too
    this.userId = null;
    this.projectId = null;
  }
}
