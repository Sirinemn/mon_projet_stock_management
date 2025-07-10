import { Injectable } from '@angular/core';
import { User } from '../../auth/models/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public isLogged = false;
  public user: User | undefined;
  public userRole!: string[];
  private userSubject = new BehaviorSubject<User | null>(null);
  private isLoggedSubject = new BehaviorSubject<boolean>(this.isLogged);

  public isLogged$(): Observable<boolean> {
    return this.isLoggedSubject.asObservable();
  }

  public logIn(user: User): void {
    this.isLogged = true;
    this.user = user;
    this.userRole = user.roles;
    this.userSubject.next(user);
    this.next();
  }

  // Nouvelle méthode pour mettre à jour les données utilisateur
  public updateUser(updatedUser: User): void {
    if (this.isLogged) {
      this.user = updatedUser;
      this.userRole = updatedUser.roles;
      this.userSubject.next(updatedUser);
    }
  }

  public logOut(): void {
    this.isLogged = false;
    this.user = undefined;
    this.userSubject.next(null);
    this.next();
  }

  public getUser(): User | undefined {
    return this.user;
  }

  public getUser$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  public getUserRole(): string[] {
    return this.userRole;
  }

  private next(): void {
    this.isLoggedSubject.next(this.isLogged);
  }
}
