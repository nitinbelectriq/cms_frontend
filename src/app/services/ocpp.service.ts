import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  city_name?: string | null;
  state_name?: string | null;
  country_name?: string | null;
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

  getChargersDynamic(loginId: string, payload: any): Observable<ChargersResponse> {
    return this.http.post<ChargersResponse>(
      `${this.baseUrl}/charger/getChargersDynamicFilterCW/${loginId}`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }

  getMenus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/chargerMonitoring/getMenus`, { headers: this.getAuthHeaders() });
  }

  getAvailabilityTypes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/chargerMonitoring/getAvailabilityType`, { headers: this.getAuthHeaders() });
  }

  getHeartbeat(payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/heartbeat`, payload, { headers: this.getAuthHeaders() });
  }

  getRFIDsByCpoId(cpoId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/rfid/getRFidsByCpoId/${cpoId}`, { headers: this.getAuthHeaders() });
  }

  getChargerConnectorStatus(chargerId: string): Observable<any> {
    return this.http.get(`${this.middleUrl}/chargerConnectorStatus/${chargerId}`, { headers: this.getAuthHeaders() });
  }

  executeCommand(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/chargerCommand`, payload, { headers: this.getAuthHeaders() });
  }

  clearCache(payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/clearcache`, payload, { headers: this.getAuthHeaders() });
  }

 resetHard(payload: any): Observable<any> {
    // backend decides based on command in payload
    return this.http.post(`${this.middleUrl}/reset`, payload, { headers: this.getAuthHeaders() });
  }

  /** Soft Reset */
  resetSoft(payload: any): Observable<any> {
    // backend decides based on command in payload
    return this.http.post(`${this.middleUrl}/reset`, payload, { headers: this.getAuthHeaders() });
  }

getLocalListVersion(payload: any): Observable<any> {
  return this.http.post(
    `${this.middleUrl}/getlocallistversion`,
    payload, // <-- send payload here
    { headers: this.getAuthHeaders() }
  );
}


  startChargingStation(payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/remoteTransaction`, payload, { headers: this.getAuthHeaders() });
  }

  stopChargingStation(payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/remoteTransaction`, payload, { headers: this.getAuthHeaders() });
  }

  changeAvailability(payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/change_availability`, payload, { headers: this.getAuthHeaders() });
  }

  unlockConnector(payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/unlockconnector`, payload, { headers: this.getAuthHeaders() });
  }

  dataTransfer(payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/dataTransfer`, payload, { headers: this.getAuthHeaders() });
  }

  getdiagnostics(payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/getdiagnostics`, payload, { headers: this.getAuthHeaders() });
  }

  getUpdateFirmware(payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/updatefirmware`, payload, { headers: this.getAuthHeaders() });
  }

  getDataTriggerMessage(payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/triggermessage`, payload, { headers: this.getAuthHeaders() });
  }

  getChangeConfiguration(payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/changeconfiguration`, payload, { headers: this.getAuthHeaders() });
  }

  getReserveNow(payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/reservenow`, payload, { headers: this.getAuthHeaders() });
  }

  getActiveChargingStationsWithChargersAndConnectorsCW(loginId: string): Observable<any> {
    return this.http.get(`${this.middleUrl}/getActiveChargingStationsWithChargersAndConnectorsCW/${loginId}`, {
      headers: this.getAuthHeaders()
    });
  }
   getActiveTransactionId(charger_id: string,connector:number): Observable<any> {
    return this.http.get(`${this.middleUrl}/getActiveTransactionId/${charger_id}/${connector}`, {
      headers: this.getAuthHeaders()
    });
  }

  getActiveChargingStationsCW(loginId: string): Observable<any> {
    return this.http.get(`${this.middleUrl}/getActiveChargingStationsCW/${loginId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllChargingStationsWithChargersAndConnectorsCW(userId: string): Observable<any> {
    return this.http.get(`${this.middleUrl}/getAllChargingStationsWithChargersAndConnectorsCW/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getConfiguration(payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/getConfiguration`, payload, { headers: this.getAuthHeaders() });
  }

  getStatus(payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/status`, payload, { headers: this.getAuthHeaders() });
  }

  getChargerConfigurationKeys(): Observable<any> {
    return this.http.get(`${this.baseUrl}/master/getChargerConfigurationKeys`, { headers: this.getAuthHeaders() });
  }

  getChargingStationsByUserRoleAndLatLong(userId: string, payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/getChargingStationsByUserRoleAndLatLong/${userId}`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  getChargingStationsByUserRoleAndLatLongUW(userId: string, payload: any): Observable<any> {
    return this.http.post(`${this.middleUrl}/getChargingStationsByUserRoleAndLatLongUW/${userId}`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  getTriggermessage(loginId: string, payload: any): Observable<any>{
    return this.http.post(`${this.middleUrl}/triggermessage`, payload, {
      headers: this.getAuthHeaders()
    });
  }

// inside OCPPService
getOcppLogs(
  chargerId: string,
  loginId: string,
  fromDate: string = '',
  toDate: string = ''
) {
  const payload = {
    charger_id: chargerId,
    f_date: fromDate,
    t_date: toDate
  };

  console.log('📤 Sending OCPP Logs Payload:', payload);

  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  return this.http.post<any[]>(
    `${this.middleUrl}/charger/${loginId}`,
    payload,
    { headers }
  );
}

updateFirmware(payload: any) {
  return this.http.post(`${this.middleUrl}/updatefirmware`, payload);
}
callDataTransfer(payload: any) {
  return this.http.post(`${this.middleUrl}/dataTransfer`, payload);
}

setChargingProfile(payload: any){
  return this.http.post(`${this.middleUrl}/setChargingProfile`, payload, {
    headers: this.getAuthHeaders()
  });
}

clearChargingProfile(payload: any){
  return this.http.post(`${this.middleUrl}/clearChargingProfile`, payload, {
    headers: this.getAuthHeaders()
  })
}

getCancelReservation(payload: any){
  return this.http.post(`${this.middleUrl}/cancelreservation`, payload, {
    headers: this.getAuthHeaders()
  })
}

getactiveReservationId(payload: any){
  return this.http.post(`${this.middleUrl}/getActiveReservationId`, payload, {
    headers: this.getAuthHeaders()
  })
}

getAllChargingProfile(){
  return this.http.get(`${this.baseUrl}/charger/getAllChargingProfileList`, { headers: this.getAuthHeaders() });


}
  
}
