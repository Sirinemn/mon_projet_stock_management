import { TestBed } from '@angular/core/testing';

import { ContactService } from './contact.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactRequest } from '../shared/models/contactRequest';
import { MessageResponse } from '../shared/models/messageResponse';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting() 
      ]
    });
    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should send email request successfully', () => {
    const mockRequest: ContactRequest = { name: 'John Doe', email: 'john.doe@example.com', subject: 'Support', message: 'Need help!' };
    const mockResponse: MessageResponse = { message: 'Message envoyé avec succès' };

    service.sendEmail(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });
});
