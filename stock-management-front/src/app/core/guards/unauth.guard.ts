import { CanActivate, Router } from "@angular/router";
import { SessionService } from "../services/session.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UnauthGuard implements CanActivate {
  constructor(private sessionService: SessionService, private router: Router) {}

  canActivate(): boolean {

    if (this.sessionService.isLogged) {
      this.router.navigate(['features_routes/dashboard']);
      return false;
    }
    return true;
  }
  
}