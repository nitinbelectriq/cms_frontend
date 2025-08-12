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
  executeCommand(payload:{ serial_no: string; type: string; created_by: string }) {
  return this.http.post(`${this.baseUrl}/chargerCommand`, payload, {
    headers: this.getAuthHeaders()
  });
}

  clearCache( payload: {command: string; charger_id: string; charger_sr_no: string; connector: number}){
    return this.http.post(`${this.middleUrl}/clearcache`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  resetHard(payload: {command: string; charger_id: string; charger_sr_no: string; connector: number }){
    return this.http.post(`${this.middleUrl}/reset`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  getlocallistversion(): Observable<any>{
    return this.http.get(`${this.middleUrl}/getlocallistversion`,{
      headers: this.getAuthHeaders()
    });
  }

  //

  startChargingStation(payload:{}){
    return this.http.post(`${this.middleUrl}/remoteTransaction`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  stopChargingStation(payload : {}){
    const headers= this.getAuthHeaders();
    return this.http.post(`${this.middleUrl}/remoteTransaction`, payload, {
      headers
    });
  }

  changeAvailability(payload : {}) {
    return this.http.post(`${this.middleUrl}/change_availability`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  unlockConnector(payload : {}) {
    return this.http.post(`${this.middleUrl}/unlockconnector`, payload , {
      headers: this.getAuthHeaders()
    });
  }

  dataTransfer(payload : {}) {
    return this.http.post(`${this.middleUrl}/dataTransfer`, payload, {
      headers: this.getAuthHeaders()
    })
  }

  getdiagnostics(payload: {}){
    return this.http.post(`${this.middleUrl}/getdiagnostics`, payload , {
      headers : this.getAuthHeaders()
    });
  }

  getUpdateFirmware(payload: {}){
    return this.http.post(`${this.middleUrl}/updatefirmware`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  getDataTriggerMessage(payload : {}){
    return this.http.post(`${this.middleUrl}/triggermessage`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  getChangeConfiguration( payload: {}){
    return this.http.post(`${this.middleUrl}/changeconfiguration`, payload , {
      headers: this.getAuthHeaders()
    });
  }

  getReserveNow(payload: {}){
    return this.http.post(`${this.middleUrl}/reservenow`, payload , {
      headers: this.getAuthHeaders()
    });
  }

  getActiveChargingStationsWithChargersAndConnectorsCW(loginId: string){
    return this.http.get(`${this.middleUrl}/getActiveChargingStationsWithChargersAndConnectorsCW/${loginId}`);
  }

   getActiveChargingStationsCW(loginId: string){
    return this.http.get(`${this.middleUrl}/getActiveChargingStationsCW/${loginId}`);
  }

   getAllChargingStationsWithChargersAndConnectorsCW(user_id:string){
    return this.http.get(`${this.middleUrl}/getAllChargingStationsWithChargersAndConnectorsCW/${user_id}`);
  }

  getConfiguration(payload : {}){
    return this.http.post(`${this.middleUrl}/getConfiguration`,payload, {
      headers: this.getAuthHeaders()
    });
  }


    getStatus(payload: {}){
    return this.http.post(`${this.middleUrl}/status`,payload, {
      headers: this.getAuthHeaders()
    });


  }

   getChargerConfigurationKeys(){
    return this.http.get(`${this.baseUrl}/master/getChargerConfigurationKeys`);
  }

   getMultipleChargerSerial(){
    let data =[ {id : 1,serial_no:'ktech_1'},
      {id : 2,serial_no:'ktech_2'},
      {id : 3,serial_no:'ktech_3'},
    ]
    return data;
  }

   getChargingStationsByUserRoleAndLatLong(userId: string, payload: {}){
    return this.http.post(`${this.middleUrl}/getChargingStationsByUserRoleAndLatLong/${userId}`,payload, {
      headers: this.getAuthHeaders()
    });
  }

  getChargingStationsByUserRoleAndLatLongUW(userId: string , payload: {}){
    return this.http.post(`${this.middleUrl}/getChargingStationsByUserRoleAndLatLongUW/${userId}`,payload, {
      headers: this.getAuthHeaders()
    });
  }





}
