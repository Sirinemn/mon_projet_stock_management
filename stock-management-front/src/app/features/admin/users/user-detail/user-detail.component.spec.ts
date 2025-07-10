import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailComponent } from './user-detail.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';


describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let mockAdminService: any = {
    getUser: jest.fn().mockReturnValue({
      subscribe: jest.fn()
    })
  };
  let mockRouter: any = { events: { subscribe: jest.fn() }, createUrlTree: jest.fn(), serializeUrl: jest.fn() };
  const mockActivatedRoute = {
    snapshot: { params: { id:123 } }
  };
  let mockUser = {
    id: 123,
    email: 'test@mail.fr',
    lastname: 'Doe',  
    firstname: 'John',
    dateOfBirth: '1990-01-01',
    createdDate: '2023-01-01',
    firstLogin: true,
    roles: ['user'],
    groupId: 1,
    createdBy: 1,
    groupName: 'group1',
    lastModifiedDate: '2023-01-01',
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: 'AdminService', useValue: mockAdminService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;   
    component.user = mockUser; 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getUser on init', () => {
    const getUserSpy = jest.spyOn(component, 'getUser');
    component.ngOnInit();
    expect(getUserSpy).toHaveBeenCalled();
  });
  it('should call back method', () => {
    const backSpy = jest.spyOn(window.history, 'back');
    component.back();
    expect(backSpy).toHaveBeenCalled();
  });
  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component.destroy$, 'next');
    
    component.ngOnDestroy();
    
    expect(spy).toHaveBeenCalled();
  });
});
