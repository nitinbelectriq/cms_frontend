import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Role {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  project_id: number;
  client_id: number;
  client_name: string;
  status: string;
  created_date?: string | null;
  createdby?: number | null;
  modify_date?: string | null;
  modifyby?: number | null;
}

export interface RoleApiResponse {
  status: boolean;
  err_code: string;
  message: string;
  count: number;
  data: Role[];
}

@Injectable({ providedIn: 'root' })
export class RoleService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getRolesCW(userId: string, projectId: string): Observable<RoleApiResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<RoleApiResponse>(`${this.baseUrl}/role/getRoleCW/${userId}/${projectId}`, { headers });
  }
}
