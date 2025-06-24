import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageRfidService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCpoRFidMapping(login_id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/rfid/getCpoRFidMappingCW/${login_id}`, { headers });
  }

  createCpoRfidMapping(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    // Confirm your backend route URL, if your backend uses /rfid/create, change accordingly
    return this.http.post(`${this.baseUrl}/rfid/createCpoRfidMapping`, data, { headers });
  }

  updateCpoRfidMapping(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    // Confirm your backend route URL, if your backend uses /rfid/update, change accordingly
    return this.http.post(`${this.baseUrl}/rfid/updateCpoRfidMapping`, data, { headers });
  }

  getActiveClientsCW(userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/client/getActiveClientsCW/${userId}`, { headers });
  }

  getCpoByClientId(clientId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/cpo/getCpoByClientId/${clientId}`, { headers });
  }

  getAllRFidsWithMappedCPOs(cpoId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/rfid/getAllRFidsWithMappedCPOs/${cpoId}`, { headers });
  }
  
deleteCpoRfidMapping(id: number, userId: number) {
  const headers = this.getAuthHeaders();
  return this.http.delete(`${this.baseUrl}/rfid/unMapRFidCpoID/${id}/${userId}`, { headers });
}

}
