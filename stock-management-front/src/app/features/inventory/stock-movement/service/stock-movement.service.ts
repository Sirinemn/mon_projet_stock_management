import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StockMovement } from '../../models/stockmovement';
import { Observable } from 'rxjs';
import { MessageResponse } from '../../../../shared/models/messageResponse';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockMovementService {

  private apiUrl = `${environment.apiUrl}/stocks`;
  constructor(private http: HttpClient) { }

  public addStockMovement(movement: StockMovement): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/movement`, movement);
  }

  public getStockMovementsByProduct(productId: number, groupId?: number): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(`${this.apiUrl}/movements/${productId}groupId?=${groupId}`);
  }

  public getHistory(filters: {
    userId?: number;
    productId?: number;
    groupId?: number;
    startDate?: string;
    endDate?: string;
  }): Observable<StockMovement[]> {
    // Supprimer les champs undefined
    const cleanedFilters = Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as any);

    return this.http.post<StockMovement[]>(`${this.apiUrl}/history`, filters);
  }

  public getStockMovementsByGroup(groupId: number): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(`${this.apiUrl}/movements?groupId=${groupId}`);
  }
  public deleteStockMovement(id: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/movement/${id}`);
  }
  public updateStockMovement(id: number, movement: StockMovement): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${this.apiUrl}/movement/${id}`, movement);
  }
  public getStockMovement(id: number): Observable<StockMovement> {
    return this.http.get<StockMovement>(`${this.apiUrl}/movement/${id}`);
  }
}


