import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getDashboardSummary(): Observable<any> {
    const userId = this.authService.getUserId();
    console.log('Using User ID:', userId);

    return this.http.get(`${this.apiUrl}/chargingStation/getActiveChargingStationsWithChargersAndConnectorsCW/${userId}`);
  }
}

