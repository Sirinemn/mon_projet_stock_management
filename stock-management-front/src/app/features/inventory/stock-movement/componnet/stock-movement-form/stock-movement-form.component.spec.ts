import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMovementFormComponent } from './stock-movement-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('StockMovementFormComponent', () => {
  let component: StockMovementFormComponent;
  let fixture: ComponentFixture<StockMovementFormComponent>;
  const mockActivatedRoute = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue('123') } }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockMovementFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockMovementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
