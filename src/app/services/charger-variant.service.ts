import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './login.service';

export interface ChargerVariant {
  id: string | number;
  variantName: string;
  chargerType: string;
  manufacturer: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ChargerVariantService {
  private baseUrl = environment.apiBaseUrl; // API base URL

  constructor(private http: HttpClient, private authService: AuthService) { }
  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  
  getAll(): Observable<ChargerVariant[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<ChargerVariant[]>(`${this.baseUrl}/chargingModel/getChargingModelsAll`, { headers });
  }
  
  create(data: ChargerVariant): Observable<ChargerVariant> {
    const headers = this.getAuthHeaders();
    const created_by = this.authService.getUserId();

    if (!created_by) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const newData = { 
    };
  
    return this.http.post<ChargerVariant>(`${this.baseUrl}/chargingModel/create`, newData, { headers });
  }
  
  update(data: ChargerVariant): Observable<ChargerVariant> {
    const headers = this.getAuthHeaders();
    const modify_by = this.authService.getUserId();

    if (!modify_by) {
      return throwError(() => new Error('User is not authenticated'));
    }
    if (!data.id) {
      return throwError(() => new Error('Id is required to update charger'));
    }
    const newData = {
    };
  
    return this.http.post<ChargerVariant>(`${this.baseUrl}/chargingModel/update`, newData, { headers });
  }
  
  delete(id: number): Observable<{ message: string }> {
    const headers = this.getAuthHeaders();
    const modify_by = this.authService.getUserId();

    if (!modify_by) {
      return throwError(() => new Error('User is not authenticated'));
    }
  
    return this.http.request<{ message: string }>('delete', `${this.baseUrl}/chargingModel/delete/${id}`, {
      headers,
      body: { modify_by }
    });
  }
}

