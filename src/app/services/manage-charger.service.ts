import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Charger {
  id: number;
  clientName: string;
  name: string;
  serialNo: string;
  modelName: string;
  status: string;
}

export interface ChargerApiResponse {
  status: boolean;
  message: string;
  count: number;
  data: Charger[];
}

@Injectable({
  providedIn: 'root'
})
export class ChargerService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getChargers(): Observable<ChargerApiResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<ChargerApiResponse>(`${this.baseUrl}/charger/getChargers`, { headers });
  }

  deleteCharger(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/charger/delete/${id}`, { headers });
  }

  getAllVersions(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/version/getVersions`, { headers });
  }

  getModelVariants(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/chargingModel/getChargingModels`, { headers });
  }
  createCharger(data: any): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.post(`${this.baseUrl}/charger/create`, data, { headers });
}
updateCharger( data: any) {
  const headers = this.getAuthHeaders();
  return this.http.post(`${this.baseUrl}/charger/update`, data, { headers });
}

}
