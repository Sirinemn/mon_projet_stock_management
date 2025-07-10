import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router, } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { SessionService } from './core/services/session.service';
import { AuthStateService } from './core/services/auth-state.service';
import { MatDialog } from '@angular/material/dialog';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let activatedRouteMock: any;
  const mockDialog = {
    open: jest.fn().mockReturnValue({
      afterClosed: () => of('redirect')
    }),
    openDialogs: []
  };
  const mockSessionService = {
    isLogged$: jest.fn().mockReturnValue(of(true)),
    logIn: jest.fn(),
    logOut: jest.fn()
  };
  const mockAuthStateService = {
    getIsAdmin: jest.fn().mockReturnValue(of(false)),
    getFirstLogin: jest.fn().mockReturnValue(of(true)),
    setFirstLogin: jest.fn(),
    setIsAdmin: jest.fn()
  };
  const mockRouter = {
    navigate: jest.fn(),
    url: '/features/dashboard',
    events: of() // Mocking router events
  };
  const mockAuthService = {
    getAuthenticatedUser: jest.fn().mockReturnValue(
      of({
        id: 1,
        email: 'test@example.com',
        firstLogin: true,
        roles: ['USER']
      })
    )
  };

  beforeEach(async () => {
    activatedRouteMock = {
      snapshot: {
        paramMap: of({})
      }
    };
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'stock-management-front' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('stock-management-front');
  });
  it('should handle successful login and update user state', () => {
    component.setupAutoLogin();

    expect(mockAuthService.getAuthenticatedUser).toHaveBeenCalled();
    expect(mockSessionService.logIn).toHaveBeenCalled();
  });
  it('should open password change dialog if first login', () => {
    component.setupFirstLoginCheck();

    expect(mockSessionService.isLogged$).toHaveBeenCalled();
    expect(mockDialog.open).toHaveBeenCalled();
  });
  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component.destroy$, 'next');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
