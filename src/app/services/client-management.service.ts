import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getClients(loginId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/client/getClientsCW/${loginId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/master/getCountries`, {
      headers: this.getAuthHeaders(),
    });
  }

  getStates(countryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/master/getStateByCountry/${countryId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getCitiesByState(stateId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/master/getCityByState/${stateId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createClient(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/client/create`, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  updateClient(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/client/update`, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/client/delete/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
