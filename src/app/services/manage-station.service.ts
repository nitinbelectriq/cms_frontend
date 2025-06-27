import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StationService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

 getAllStations(user_id: number): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get<any>(
    `${this.baseUrl}/chargingStation/getAllChargingStationsWithChargersAndConnectorsCW/${user_id}`,
    { headers }
  );
}

}
