import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListComponent } from './users-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { SessionService } from '../../../../core/services/session.service';
import { AdminService } from '../../services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let mockRouter: any = { events: { subscribe: jest.fn() }, createUrlTree: jest.fn(), serializeUrl: jest.fn(), navigate: jest.fn() };
  const mockActivatedRoute = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue('mockValue') } }
  };
  const mockSessionService = {
    user: { id: 1 }
  };
  const mockAdminService = {
    getUsers: jest.fn().mockReturnValue(of([{ id: 1, firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com' }])),
    deleteUser: jest.fn().mockReturnValue(of({}))
  };
  const mockDialog = {
    open: jest.fn().mockReturnValue({ afterClosed: () => of(true) })
  };
  const mockSnackBar = {
    open: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SessionService, useValue: mockSessionService },
        { provide: AdminService, useValue: mockAdminService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load users on init', () => {
    component.ngOnInit();

    expect(mockAdminService.getUsers).toHaveBeenCalledWith(1);
    expect(component.users.data.length).toBe(1);
  });
  it('should delete user when confirmed', () => {
    const userId = 1;
    jest.spyOn(mockDialog, 'open').mockReturnValue({ afterClosed: () => of(true) } as any);

    component.deleteUser(userId);

    expect(mockAdminService.deleteUser).toHaveBeenCalledWith(userId);
  });
});
