import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserRole {
  f_name: string;
  l_name: string;
  username: string;
  role_id: number;
  role_code: string;
  role_name: string;
  client_id: number;
  client_name: string;
  map_id: number;
  default_role: string | null;
  user_id: number;
  map_status: 'Y' | 'N';
  status?: string; // Computed: 'Active' | 'Inactive'
  created_date: string | null;
  createdby: number | null;
  modify_date: string | null;
  modifyby: number | null;
}

export interface RoleApiResponse {
  status: boolean;
  err_code: string;
  message: string;
  count: number;
  data: UserRole[];
}

@Injectable({
  providedIn: 'root'
})
export class UserRolesService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getUserRoles(userId: string, projectId: string): Observable<RoleApiResponse> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl}/user/getUserRoleMappingCW/${userId}/${projectId}`;
    return this.http.get<RoleApiResponse>(url, { headers });
  }
deleteUser(id: number, userId: number): Observable<any> {
  return this.http.delete<any>(
    `${this.baseUrl}/user/deleteUserRoleMapping/${id}/${userId}`,  // Use userId, not user_id
    { headers: this.getAuthHeaders() }
  );
}


}
