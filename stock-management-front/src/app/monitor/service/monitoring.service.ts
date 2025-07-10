import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) { }

  public getHealth(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/actuator/health`);
  }
  public getInfo(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/actuator/info`);
  }
}
