import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces
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
  cpo_id?: string;
  heartbeat_interval?: string;
  power?: string;
  last_ping_datetime?: string;
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
  private middleUrl = environment.apiMiddleUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getChargersDynamic(
    loginId: string,
    payload: { cpo_id: string; station_id: string }
  ): Observable<ChargersResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<ChargersResponse>(
      `${this.baseUrl}/charger/getChargersDynamicFilterCW/${loginId}`,
      payload,
      { headers }
    );
  }

  getMenus(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/chargerMonitoring/getMenus`, { headers });
  }

  getAvailabilityTypes(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/chargerMonitoring/getAvailabilityType`, { headers });
  }

  getHeartbeat(payload:{charger_id:string}): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.middleUrl}/heartbeat`,payload , { headers });
  }

  getRFIDsByCpoId(cpoId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/rfid/getRFidsByCpoId/${cpoId}`, { headers });
  }

  getChargerConnectorStatus(chargerId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.middleUrl}/chargerConnectorStatus/${chargerId}`, { headers });
  }
  executeCommand(payload: { serial_no: string; type: string; created_by: string }) {
  return this.http.post(`${this.baseUrl}/chargerCommand`, payload, {
    headers: this.getAuthHeaders()
  });
}

}
