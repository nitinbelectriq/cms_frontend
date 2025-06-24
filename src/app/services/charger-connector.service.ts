import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Raw API response model
export interface RawConnectorModel {
  id: number;
  ct_id: number;
  ct_name: string;
  vm_id: number;
  vm_name: string;
  vType_id: number;
  vType_name: string;
  created_date: string;
  status: string;
  brand_id: number;
  model_image_url: string;
}

// API wrapper type
export interface ApiResponse<T> {
  status: string;
  data: T;
  err_code?: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ConnectorService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  /** GET all connectors */
  getAllConnectors(): Observable<ApiResponse<RawConnectorModel[]>> {
    return this.http.get<ApiResponse<RawConnectorModel[]>>(
      `${this.baseUrl}/publishedVModel`,
      { headers: this.getAuthHeaders() }
    );
  }

  /** POST: Create new connector */
createVModelConnectorMapping(payload: any): Observable<ApiResponse<any>> {
  return this.http.post<ApiResponse<any>>(
    `${this.baseUrl}/vModel_Ctype`,
    payload,
    { headers: this.getAuthHeaders() }
  );
}
deleteMapping(id: number, userId: number): Observable<any> {
  return this.http.delete<any>(
    `${this.baseUrl}/deleteC_Type_V_Model_Mapping/${id}/${userId}`,
    { headers: this.getAuthHeaders() }
  );
}



  /** PUT: Update connector */
  updateConnector(id: number, payload: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.baseUrl}/connector/update/${id}`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }

  /** GET: Fetch brands */
  getBrands(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/brands`,
      { headers: this.getAuthHeaders() }
    );
  }


  /** GET: Fetch vehicle models by brandId */
  getVehicleModelsByBrand(brandId: number): Observable<ApiResponse<any[]>> {
    console.log("hiii api");
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/vehicleModels/${brandId}`,
      { headers: this.getAuthHeaders() }
    );
  }
 /** GET: Fetch vehicle types */
  getVehicleTypes(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/vehicleTypes`,
      { headers: this.getAuthHeaders() }
    );
  }
  /** GET: Fetch connector types excluding selected vehicle model ID */
  getConnectorTypesExcludingVModelId(modelId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/connectorTypesExcludingVModelId/${modelId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
