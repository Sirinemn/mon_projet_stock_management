import { TestBed } from '@angular/core/testing';

import { AdminService } from './admin.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { User } from '../../../auth/models/user';
import { MessageResponse } from '../../../shared/models/messageResponse';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting() 
      ]
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch users by ID', () => {
    const mockUsers: User[] = [
      { id: 1, firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', dateOfBirth: '1990-01-01', groupId: 456, roles: ['USER'], groupName: 'Group A', createdBy: 1, createdDate: '2023-01-01', lastModifiedDate: '2023-01-02' }]
    
    service.getUsers(1).subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/users?id=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
  it('should delete user by ID', () => {
    service.deleteUser(1).subscribe();

    const req = httpMock.expectOne(`${service['apiUrl']}/users/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
  it('should add a category', () => {
    const mockResponse: MessageResponse = { message: 'Category added successfully' };

    service.addCategory('New Category', 1).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/category?name=New Category&userId=1`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
  it('should update user details', () => {
    const mockUser: User = {  id: 1, firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', dateOfBirth: '1990-01-01', groupId: 456, roles: ['ADMIN'], groupName: 'Group A', createdBy: 1, createdDate: '2023-01-01', lastModifiedDate: '2023-01-02' };
    const mockResponse: MessageResponse = { message: 'User updated successfully' };

    service.updateUser(1, mockUser).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/users/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockResponse);
  });
});
