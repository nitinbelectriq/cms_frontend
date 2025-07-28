import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './login.service';
import { map } from 'rxjs/operators';

export interface ChargerVariant {
  id: string | number;
  name: string;
  charger_model_type_name: string;
  manufacturer_name: string;
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
  
 create(data: any): Observable<ChargerVariant> {
  const headers = this.getAuthHeaders();
  const created_by = this.authService.getUserId();

  if (!created_by) {
    return throwError(() => new Error('User is not authenticated.'));
  }

  // Add created_by to the data object
  const payload = { ...data, created_by };

  // Send payload exactly as backend expects
  return this.http.post<ChargerVariant>(`${this.baseUrl}/chargingModel/create`, payload, { headers });
}


  
// charger-variant.service.ts
update(data: any): Observable<any> {
  const headers = this.getAuthHeaders();
  const modify_by = this.authService.getUserId();

  if (!modify_by) {
    return throwError(() => new Error('User is not authenticated'));
  }
  if (!data.id) {
    return throwError(() => new Error('Id is required to update charger'));
  }

  const payload = {
    ...data,
    modify_by
  };

  return this.http.post<any>(`${this.baseUrl}/chargingModel/update`, payload, { headers });
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
getChargerModels(): Observable<any[]> {
  return this.http.get<any>(`${this.baseUrl}/chargerType/getActiveChargerTypes`, {
    headers: this.getAuthHeaders()
  }).pipe(map(res => res.data || []));
}

getManufacturers(): Observable<any[]> {
  return this.http.get<any>(`${this.baseUrl}/manufacturer/getManufacturers`, {
    headers: this.getAuthHeaders()
  }).pipe(map(res => res.data || []));
}

getModelTypes(): Observable<any[]> {
  return this.http.get<any>(`${this.baseUrl}/charger_model_type/getChargerModelTypes`, {
    headers: this.getAuthHeaders()
  }).pipe(map(res => res.data || []));
}

getProtocols(): Observable<any[]> {
  return this.http.get<any>(`${this.baseUrl}/communication_protocol/getCommunicationProtocols`, {
    headers: this.getAuthHeaders()
  }).pipe(map(res => res.data || []));
}

getConnectorTypes(): Observable<any[]> {
  return this.http.get<any>(`${this.baseUrl}/connectorTypes`, {
    headers: this.getAuthHeaders()
  }).pipe(map(res => res.data || []));
}

getIoTypes(): Observable<any[]> {
  return this.http.get<any>(`${this.baseUrl}/io_type/getIOTypes`, {
    headers: this.getAuthHeaders()
  }).pipe(map(res => res.data || []));
}

getCurrentTypes(): Observable<any[]> {
  return this.http.get<any>(`${this.baseUrl}/current_type/getCurrentTypes`, {
    headers: this.getAuthHeaders()
  }).pipe(map(res => res.data || []));
}
getChargerVariantById(id: string | number): Observable<ChargerVariant> {
  return this.http.get<ChargerVariant>(`/chargingModel/getChargingModelById/${id}`);
}

}

