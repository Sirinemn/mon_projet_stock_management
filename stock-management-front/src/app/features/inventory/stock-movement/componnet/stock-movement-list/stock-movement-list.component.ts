import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StockMovement } from '../../../models/stockmovement';
import { SessionService } from '../../../../../core/services/session.service';
import { StockMovementService } from '../../service/stock-movement.service';
import { AuthStateService } from '../../../../../core/services/auth-state.service';
import { User } from '../../../../../auth/models/user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../../../mat-dialog/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-stock-movement-list',
  imports: [MatIconModule, MatTableModule, MatProgressSpinnerModule, MatButtonModule, RouterLink, MatFormFieldModule, MatOptionModule, MatSelectModule, CommonModule],
  templateUrl: './stock-movement-list.component.html',
  styleUrl: './stock-movement-list.component.scss'
})
export class StockMovementListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;

  public destroy$ = new Subject<void>();
  public errorMessage: string = '';
  public movements: StockMovement[] = [];
  public visibleMovements: StockMovement[] = [];
  public dataSource!: MatTableDataSource<StockMovement>;
  
  private itemsPerPage = 10;
  private currentPage = 1;
  public isAdmin: boolean = false;
  private user!: User;
  public displayedColumns: string[] = [];
  public isLoading = false;
  public isDischarged: boolean = false;
  public groupId: number = 0;
  

  constructor(
    private sessionService: SessionService,
    private authStateService: AuthStateService,
    private stockMovementService: StockMovementService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.updateColumns();
    window.addEventListener('resize', () => this.updateColumns());
    this.loadDisplayedcolumns();
    this.getUser();
  }
  updateColumns() {
    this.displayedColumns = window.innerWidth <= 600
      ? ['productName', 'actions']
      : ['productName', 'quantity', 'createdBy', 'createdAt', 'actions'];
  }
  public deleteProduct(stockId: number) {
    this.isLoading = true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Êtes-vous sûr de vouloir supprimer ?',
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.stockMovementService.deleteStockMovement(stockId).pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.snackBar.open(response.message, 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
            this.loadStockMovements();
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.message || 'Une erreur est survenue lors de la suppression du produit.';
            this.snackBar.open(this.errorMessage, 'Fermer', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        });
      } else {
        this.isLoading = false;
      }
    });
  }
  public editProduct(movementId: number) {
    this.router.navigate([`/features/stock/edit/${movementId}`]);
  }
  public viewProduct(movementId: number) {
    this.router.navigate([`/features/stock/view/${movementId}`]);
  }
  public loadDisplayedcolumns() {
    this.authStateService.getIsAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }
  public getUser() {
    this.sessionService.getUser$().pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user!;
      this.groupId = user!.groupId;
      this.loadStockMovements();
    });
  }
   public loadStockMovements() {
    this.isLoading = true;
    this.stockMovementService.getStockMovementsByGroup(this.groupId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.movements = response;
        this.dataSource = new MatTableDataSource(this.movements);       
        // Configuration du tri
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }    
        this.visibleMovements = this.movements.slice(0, this.itemsPerPage);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
        this.snackBar.open(this.errorMessage, 'Fermer', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  public showMoreMovements() {
    this.currentPage++;
    const nextIndex = this.currentPage * this.itemsPerPage;
    this.visibleMovements = this.movements.slice(0, nextIndex);
  }
  public back() {
    window.history.back();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('resize', () => this.updateColumns());
  }
}
