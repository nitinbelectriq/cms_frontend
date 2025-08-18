import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Client {
  client_id: number;
  name: string;
}

export interface Role {
  id: number;
  code: string;
  name: string;
  description: string;
  project_id: number;
  client_id: number;
  client_name: string;
  status: string;
  created_date: string;
  createdby: number;
  modify_date: string;
  modifyby: number;
}

export interface MenuItem {
  rm_map_id: number;
  menu_id: number;
  title: string;
  client_id: number;
  parent_id: number | null;
  children?: MenuItem[];
  isAssigned?: boolean;
  expanded?: boolean;
}

export interface ApiResponse<T> {
  status: boolean;
  err_code: string;
  message: string;
  count: number;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class roleActivity {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getActiveClientsCW(userId: number): Observable<Client[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Client[]>(`${this.baseUrl}/client/getActiveClientsCW/${userId}`, { headers });
  }

  getActiveRolesByClientId(projectId: number, clientId: number): Observable<ApiResponse<Role[]>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<Role[]>>(
      `${this.baseUrl}/role/getActiveRolesByClientId/${projectId}/${clientId}`,
      { headers }
    );
  }

  getMenusByClientIdWithRole(projectId: number, clientId: number, roleId: number): Observable<ApiResponse<MenuItem[]>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<MenuItem[]>>(
      `${this.baseUrl}/menu/getMenusByClientIdWithAlreadyMappedToRole/${projectId}/${clientId}/${roleId}`,
      { headers }
    );
  }

  // Updated to accept full payload object
  saveRoleMenus(payload: {
    client_id: number;
    role_id: number;
    menus: any[]; // menu objects with all required fields
    created_by: number;
    modify_by: number;
    created_date: string;
    modify_date: string;
    status: string;
  }): Observable<ApiResponse<any>> {
    const headers = this.getAuthHeaders();
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/menu/roleMenuMapping`, payload, { headers });
  }
}
