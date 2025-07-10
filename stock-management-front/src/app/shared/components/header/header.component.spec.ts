import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeaderComponent } from './header.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { SessionService } from '../../../core/services/session.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const mockAuthService = {
    logout: jest.fn()
  };

  const mockSessionService = {
    getUser: jest.fn().mockReturnValue({ roles: ['ADMIN'] }),
    logOut: jest.fn()
  };

  beforeEach(async () => {
    const mockActivatedRoute = {
      snapshot: { paramMap: { get: jest.fn().mockReturnValue('mockValue') } }
    };
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize isAdmin and isMonitoring correctly', () => {
    component.ngOnInit();

    expect(component.isAmin).toBeTruthy();
    expect(component.isMonitoring).toBeFalsy();
  });
  it('should call logout services on logOut()', () => {
    component.logOut();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockSessionService.logOut).toHaveBeenCalled();
  });
});
