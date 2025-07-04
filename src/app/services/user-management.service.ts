import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  cpo_id: number | null;
  client_name: string;
  client_id: number;
  username: string;
  password: string;
  f_name: string;
  m_name: string;
  l_name: string;
  dob: string;
  mobile: string;
  alt_mobile: string;
  email: string;
  address1: string;
  address2: string;
  PIN: number;
  landmark: string;
  city_id: number;
  state_id: number;
  country_id: number;
  PAN: string;
  aadhar: string;
  device_id: any;
  app_version: any;
  os_version: any;
  user_type: string;
  can_expire: string;
  hint_question: any;
  hint_answer: any;
  last_pass_change: any;
  last_login_date: any;
  employee_code: string;
  is_verified: string;
  otp: any;
  registration_origin: string;
  status: string; // 'Y' or 'N'
  created_date: string;
  createdby: number;
  modify_date: string | null;
  modifyby: number | null;
}

export interface UserApiResponse {
  status: boolean;
  err_code: string;
  message: string;
  count: number;
  data: User[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getUsers(loginId: number): Observable<UserApiResponse> {
    return this.http.get<UserApiResponse>(
      `${this.baseUrl}/user/getUsersCW/${loginId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getUserById(userId: number): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.baseUrl}/usermanagement/getUserById/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  createUser(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/usermanagement/createUser`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }

  updateUser(userId: number, payload: any): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/usermanagement/updateUser/${userId}`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }
}

