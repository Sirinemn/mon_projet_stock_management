import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  public userRole: string[] = [];
  private firstLoginSubject = new BehaviorSubject<boolean>(false);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private isMonitoringSubject = new BehaviorSubject<boolean>(false);

  public setFirstLogin(value: boolean) {
    this.firstLoginSubject.next(value);
  }
  public setIsAdmin(value: boolean) {
    this.isAdminSubject.next(value);
  }
  public getIsAdmin(): Observable<boolean> {
    return this.isAdminSubject.asObservable();
  }
  public getFirstLogin(): Observable<boolean> {
    return this.firstLoginSubject.asObservable();
  }
  public isAdmin(): boolean {
    return this.userRole && this.userRole.includes('ADMIN');
  }
  public setIsMonitoring(value: boolean) {
    this.isMonitoringSubject.next(value);
  }
  public getIsMonitoring(): Observable<boolean> {
    return this.isMonitoringSubject.asObservable();
  }
}
