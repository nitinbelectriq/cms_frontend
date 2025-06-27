import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CpoService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }
  

  /** GET: Fetch CPOs by login_id */
  getCposByLoginId(loginId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/cpo/getCposCW/${loginId}`, {
      headers: this.getAuthHeaders(),
    });
  }
  getClients(loginId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/client/getActiveClientsCW/${loginId}`, {
      headers: this.getAuthHeaders(),
    });
  }
  getCities(loginId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/cpo/getCposCW/${loginId}`, {
      headers: this.getAuthHeaders(),
    });
  }
  getStates(id: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/master/getStateByCountry/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
  getCountries(loginId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/master/getCountries`, {
      headers: this.getAuthHeaders(),
    });
  }
  getCitiesByState(stateId: number): Observable<any[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<any[]>(`${this.baseUrl}/master/getCityByState/${stateId}`, { headers });
}

  createCpo(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/cpo/create`, payload, {
      headers: this.getAuthHeaders(),
    });
  }
getCpoById(cpoId: number): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get<any>(`${this.baseUrl}/cpo/getCpoById/${cpoId}`, { headers });
}

updateCpo(payload: any): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.post<any>(`${this.baseUrl}/cpo/update`, payload, { headers });
}
deleteCpo(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.baseUrl}/cpo/delete/${id}`, { headers });
  }
}
