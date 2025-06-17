import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './login.service';

export interface ChargerModel {
  id?: number;
  name: string;
  description: string;
  status: boolean;
  created_by?: number;
  modify_by?:number;
}

@Injectable({ providedIn: 'root' })
export class ChargerModelService {
  private baseUrl = environment.apiBaseUrl; // API base URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAll(): Observable<ChargerModel[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<ChargerModel[]>(`${this.baseUrl}/chargerType/getChargerTypes`, { headers });
  }

  create(data: ChargerModel): Observable<ChargerModel> {
    const headers = this.getAuthHeaders();

    // Retrieve created_by from AuthService
    const created_by = this.authService.getUserId();

    if (!created_by) {
      // Return an observable error instead of throwing directly
      return throwError(() => new Error('User is not authenticated'));
    }
  const status = data.status ? 'Y' : 'N';
    // Combine form data with created_by
    const newData = {
      name: data.name,
      description: data.description,
      status: data.status,
      created_by
    };

    return this.http.post<ChargerModel>(`${this.baseUrl}/chargerType/create`, newData, { headers });
  }
update(data: ChargerModel): Observable<ChargerModel> {
  const headers = this.getAuthHeaders();

  // Retrieve modify_by (current user) from AuthService
  const modify_by = this.authService.getUserId();

  if (!modify_by) {
    throw new Error('User is not authenticated');
  }
  
  if (!data.id) {
    throw new Error('Id is required to update charger');
  }
  
  // Prepare the payload to send to backend
  const newData = {
    id: data.id,
    name: data.name,
    description: data.description,
    status: data.status ? 'Y' : 'N',
    modify_by
  };
  
  return this.http.post<ChargerModel>(`${this.baseUrl}/chargerType/update`, newData, { headers });
}

delete(id: number): Observable<{ message: string }> {
  const headers = this.getAuthHeaders();
  const modify_by = this.authService.getUserId();

  if (!modify_by) {
    throw new Error('User is not authenticated');
  }

  // Sending modify_by in body as JSON, so we use HttpClient.delete with body option (Angular 14+)
  return this.http.request<{ message: string }>('delete', `${this.baseUrl}/chargerType/delete/${id}`, {
    headers,
    body: { modify_by }
  });
}



}
