import { TestBed } from '@angular/core/testing';

import { CategorieService } from './categorie.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Category } from '../../../admin/models/category';

describe('CategorieService', () => {
  let service: CategorieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting() 
      ]
    });
    service = TestBed.inject(CategorieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch categories by groupId', () => {
    const mockCategories: Category[] = [{ id: 1, name: 'Electronics', groupId: 1 }, { id: 2, name: 'Books', groupId: 1 }];

    service.getCategories(1).subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}?groupId=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });
});
