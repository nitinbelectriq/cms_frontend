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
// 🔹 Dropdown APIs
getCpoList(userId: number): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get(`${this.baseUrl}/cpo/getActiveCposCW/${userId}`, { headers });
}

getLocationTypes(): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get(`${this.baseUrl}/master/getLocationTypes`, { headers });
}

getChargerRegistrationTypes(): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get(`${this.baseUrl}/master/getChargerRegistrationTypes`, { headers });
}

getElectricityLineTypes(): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get(`${this.baseUrl}/master/getElectricitylineTypes`, { headers });
}

getCountries(): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get(`${this.baseUrl}/master/getCountries`, { headers });
}

getStates(): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get(`${this.baseUrl}/master/getStates`, { headers });
}

getCitiesByState(stateId: number): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get(`${this.baseUrl}/master/getCityByState/${stateId}`, { headers });
}

  // 🔹 Get all charging stations
  getAllStations(user_id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(
      `${this.baseUrl}/chargingStation/getAllChargingStationsWithChargersAndConnectorsCW/${user_id}`,
      { headers }
    );
  }

  // 🔹 Create new station
  createStation(payload: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(
      `${this.baseUrl}/chargingStation/create`,
      payload,
      { headers }
    );
  }

  deleteStation(id: number) {
  const headers = this.getAuthHeaders();
  return this.http.delete(`${this.baseUrl}/chargingStation/delete/${id}`, { headers });
}

  // 🔹 (Optional) Update station
  updateStation(id: number, payload: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(
      `${this.baseUrl}/chargingStation/update`,
      payload,
      { headers }
    );
  }
getAmenities(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(
      `${this.baseUrl}/getAllAmenities`,
      { headers }
    );
  }

addCharger(payload: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(
      `${this.baseUrl}/charger/addChargerToStationMultiple`,
      payload,
      { headers }
    );
  }

getClientChargers(client_id: number): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get<any>(
    `${this.baseUrl}/charger/getClientChargersNotMappedToAnyStation/${client_id}`,
    { headers }
  );
}

}

