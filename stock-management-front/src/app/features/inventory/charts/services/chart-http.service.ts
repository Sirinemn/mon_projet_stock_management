import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardOverview } from '../models/dashboardOverview.model';
import { ProductQuantity } from '../models/product-quantity.model';
import { StockStats } from '../models/StockStats';
import { environment } from '../../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ChartHttpService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private httpClient: HttpClient) { }
  
  public getDashboardOverview(groupId: number): Observable<DashboardOverview> {
    return this.httpClient.get<DashboardOverview>(`${this.apiUrl}/overview?groupId=${groupId}`);
  }
   public getStockCategoryChart(groupId: number): Observable<ProductQuantity[]> {
    return this.httpClient.get<ProductQuantity[]>(`${this.apiUrl}/stock-categories?groupId=${groupId}`);
  }
  public getProductQuantities(groupId: number): Observable<ProductQuantity[]> {
    return this.httpClient.get<ProductQuantity[]>(`${this.apiUrl}/products?groupId=${groupId}`);
  }
  public getStockStats(groupId: number): Observable<StockStats> {
    return this.httpClient.get<StockStats>(`${this.apiUrl}/stats?groupId=${groupId}`);
  }
}
