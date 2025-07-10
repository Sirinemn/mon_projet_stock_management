import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordChangeDialogComponent } from './password-change-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('PasswordChangeDialogComponent', () => {
  let component: PasswordChangeDialogComponent;
  let fixture: ComponentFixture<PasswordChangeDialogComponent>;
  const mockDialogRef = {
    close: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordChangeDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should close dialog with redirect action', () => {
    const closeSpy = jest.spyOn(mockDialogRef, 'close');

    component.redirectToChangePassword();

    expect(closeSpy).toHaveBeenCalledWith('redirect');
  });
});
