import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../auth/services/auth.service';
import { SessionService } from '../../../core/services/session.service';
import { RouterLink, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';


@Component({
  selector: 'app-header',
imports: [MatToolbarModule, RouterModule, NgIf, MatIconModule, MatSidenavModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  public isAmin: boolean = false;
  public isMonitoring: boolean = false;
  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
  ) { }

  ngOnInit(): void {
    this.isAmin = this.sessionService.getUser()?.roles.includes('ADMIN') || false;
    this.isMonitoring = this.sessionService.getUser()?.roles.includes('MONITORING') || false;
  }

  public logOut() {
    this.authService.logout();
    this.sessionService.logOut();
  }

}
