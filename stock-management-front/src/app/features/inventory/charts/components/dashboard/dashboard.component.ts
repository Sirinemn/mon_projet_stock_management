import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartHttpService } from '../../services/chart-http.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { ProductQuantity } from '../../models/product-quantity.model';
import { SessionService } from '../../../../../core/services/session.service';
import { User } from '../../../../../auth/models/user';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardOverview } from '../../models/dashboardOverview.model';
import { StockStats } from '../../models/StockStats';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { StockMovement } from '../../../models/stockmovement';

@Component({
  selector: 'app-dashboard',
  imports: [PieChartComponent, CommonModule, MatProgressSpinnerModule, MatDividerModule, MatListModule, MatIconModule, MatCardModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  public pieChartData: ProductQuantity[] = [];
  public dashboardOverview: DashboardOverview | null = null;
  public stockStatusData: ProductQuantity[] = [];
  public stockStats: StockStats | null = null;
  public recentMovements: StockMovement[] = [];

  public destroy$ = new Subject<void>();
  public groupId: number = 0;
  public user: User | null = null;
  public isLoading: boolean = false;
  public errorMessage: string = '';
  public groupName: string = '';
  public userName: string = '';


  constructor(
    private chartHttp: ChartHttpService,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    this.getUser();
  }
  public getUser() {
    this.errorMessage = '';
    this.sessionService.getUser$().pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.user = user;
        this.groupId = user?.groupId || 0;
        this.groupName = user?.groupName || '';
        this.userName = user?.lastname || '';
        this.loadDashboardData();
      },
      error: (error) => {
        this.handleError(error, 'Erreur lors de la récupération des données utilisateur.');
      }
      
    });
  }

  public loadDashboardData(): void {
    if (!this.groupId) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    // Charger toutes les données en parallèle
    forkJoin({
      overview: this.chartHttp.getDashboardOverview(this.groupId),
      stockStats: this.chartHttp.getStockStats(this.groupId),
      stockStatusChart: this.chartHttp.getProductQuantities(this.groupId)
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.dashboardOverview = data.overview;
        this.stockStats = data.stockStats;
        this.stockStatusData = data.stockStatusChart;
        this.recentMovements = data.overview.recentMovements || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError(error, 'Erreur lors du chargement des données du dashboard.');
      }
    });
  }
  
   private handleError(error: any, defaultMessage: string): void {
    this.errorMessage = error?.error?.message || defaultMessage;
    console.error(defaultMessage, error);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
