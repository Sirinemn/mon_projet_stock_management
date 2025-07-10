import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ContactService } from '../../service/contact.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  const mockContactService = {
    sendEmail: jest.fn().mockReturnValue(of({ message: 'Message envoyé avec succès' }))
  };

  const mockSnackBar = {
    open: jest.fn()
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ContactService, useValue: mockContactService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should send email successfully when form is valid', () => {
    component.formGroup.setValue({
      name: 'John Doe',
      subject: 'Support Technique',
      email: 'john.doe@example.com',
      message: 'Besoin d\'aide avec mon compte'
    });

    component.submitForm();

    expect(mockContactService.sendEmail).toHaveBeenCalledWith(expect.any(Object));
    expect(mockSnackBar.open).toHaveBeenCalledWith('Message envoyé avec succès', 'Fermer', { duration: 3000 });
    expect(component.isLoading).toBeFalsy();
  });
  it('should not send email when form is invalid', () => {
    component.formGroup.setValue({
      name: '',
      subject: '',
      email: 'invalid-email',
      message: ''
    });

    component.submitForm();

    expect(component.errorMessage).toBe("Veuillez remplir tous les champs correctement.");
  });
  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component.destroy$, 'next');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
