import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}`;
  private userId: number | null = null;

  constructor(private http: HttpClient) {}

  login(credentials: { user_name: string; password: string; project_code: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        const id = response?.id;
        console.log(response);
        if (id) {
          this.userId = id;
          localStorage.setItem('user_id', id.toString()); // Store it for later use
        }
      })
    );
  }

  getUserId(): number | null {
    return this.userId || Number(localStorage.getItem('user_id'));
  }
}

