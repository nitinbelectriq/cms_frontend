import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // <-- Added HttpHeaders import
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces unchanged...

export interface ConnectorData {
  connector_no: number;
  connector_type_name: string;
  io_type_name: string;
  voltage: string;
  max_amp: string;
  power: string;
  status: string;
}

export interface ChargerRaw {
  serial_no: string;
  station_name: string;
  version_name: string;
  no_of_guns: number;
  address1: string;
  address2: string;
  landmark: string;
  city_name: string | null;
  state_name: string | null;
  country_name: string | null;
  is_available: number;
  charger_status: string;
  connector_data: ConnectorData[];
}

export interface ChargersResponse {
  status: boolean;
  message: string;
  count: number;
  data: ChargerRaw[];
}

@Injectable({ providedIn: 'root' })
export class OCPPService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getChargersDynamic(loginId: string, payload: { cpo_id: string; station_id: string }): Observable<ChargersResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<ChargersResponse>(
      `${this.baseUrl}/charger/getChargersDynamicFilterCW/${loginId}`,
      payload,
      { headers }  // Passing headers in request options
    );
  }
}
