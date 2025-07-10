import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsComponent } from './terms.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('TermsComponent', () => {
  let component: TermsComponent;
  let fixture: ComponentFixture<TermsComponent>;
    let activatedRouteMock: any= {
          snapshot: {
            paramMap: of({})
          }
        };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
