import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageRfidService {
  private baseUrl = environment.apiBaseUrl; // e.g. http://localhost:3000/api

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  
  getAllRfids(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/rfid/getRFids`, { headers });
  }

  createRfid(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/rfid/create`, data, { headers });
  }

  updateRfid(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/rfid/update`, data, { headers });
  }
  deleteRfid(id: number, userId: number): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.delete(`${this.baseUrl}/rfid/delete/${id}/${userId}`, { headers });
}

}
