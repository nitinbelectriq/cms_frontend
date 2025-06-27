import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DispatchService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getClientChargers(loginId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/charger/getClientChargers/${loginId}`, { headers });
  }

  deleteCharger(id: number, user_id: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any[]>(`${this.baseUrl}/charger/deleteChargerFromClient/${id}/${user_id}`, { headers });
  }

  getClients(loginId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/client/getActiveClientsCW/${loginId}`, { headers });
  }

  getChargers(): Observable<{ data: any[] }> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ data: any[] }>(`${this.baseUrl}/charger/getChargers`, { headers });
  }

  dispatchChargers(payload: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.baseUrl}/charger/dispatchChargers`, payload, { headers });
  }

  updateClientChargers(payload: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.baseUrl}/charger/updateClientChargers`, payload, { headers });
  }
}
