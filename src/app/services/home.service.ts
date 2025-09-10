import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}
 
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getDashboardSummary(): Observable<any> {
    const userId = this.authService.getUserId();
    console.log('Using User ID:', userId);

    return this.http.get(`${this.apiUrl}/chargingStation/getActiveChargingStationsWithChargersAndConnectorsCW/${userId}`);
  }


  getAllChargingStationsWithChargersAndConnectorsCW(userId: string) {
     const headers = this.getAuthHeaders();
  return this.http.get<any>(`${this.apiUrl}/chargingStation/getAllChargingStationsWithChargersAndConnectorsCW/${userId}`,{
      headers: this.getAuthHeaders(),
    });;
}

}

