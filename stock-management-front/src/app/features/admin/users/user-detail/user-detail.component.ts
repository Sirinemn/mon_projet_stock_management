import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../../auth/models/user';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { takeUntil, Subject } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-detail',
  imports: [MatIconModule, MatCardModule, DatePipe, CommonModule, MatProgressSpinnerModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit , OnDestroy {
  public isloading: boolean = false;
  public user!: User;
  public userId: number = 0;
  public destroy$ = new Subject<void>();
  public errorMessage: string = '';

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'] || 0;
    this.getUser();
  }

  public back() {
    window.history.back();
  }
  public getUser(): void {
    this.isloading = true;
    this.adminService.getUser(this.userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (user: User) => {
        this.user = user;
        this.isloading = false;
      },
      error: () => {
        this.isloading = false;
        this.errorMessage = 'Error loading user';
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
