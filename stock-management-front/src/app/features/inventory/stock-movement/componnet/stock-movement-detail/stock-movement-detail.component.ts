import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockMovementService } from '../../service/stock-movement.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { StockMovement } from '../../../models/stockmovement';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-stock-movement-detail',
  imports: [MatIconModule, MatCardModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './stock-movement-detail.component.html',
  styleUrl: './stock-movement-detail.component.scss'
})
export class StockMovementDetailComponent implements OnInit, OnDestroy {
  public isLoading: boolean = false;
  public stockMovement: StockMovement | undefined;
  public stockMovementId: number = 0;
  public errorMessage: string = '';
  public destroy$ = new Subject<void>();
  
  constructor(
    private stockMovementService: StockMovementService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.stockMovementId = this.route.snapshot.params['id'] || 0;
    this.getStockMovement(this.stockMovementId);
  }
  private getStockMovement(id: number) {
    this.isLoading = true;
    this.stockMovementService.getStockMovement(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (stockMovement) => {
        this.stockMovement = stockMovement;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false
        this.errorMessage = error.error.message || 'Erreur lors du chargement du mouvement de stock.';
      }
    });
  }
  public back() {
    window.history.back();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
