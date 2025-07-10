import { CommonModule, NgClass } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from '../../service/contact.service';
import { Subject, takeUntil } from 'rxjs';
import { ContactRequest } from '../../shared/models/contactRequest';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contact',
  imports: [MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatProgressSpinnerModule, NgClass, CommonModule, MatInputModule, MatOptionModule, MatSelectModule, MatIconModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnDestroy{
  public formGroup: FormGroup;
  public destroy$ = new Subject<void>();
  public isLoading: boolean = false;
  public errorMessage: string ="";
  public  subjectOptions: string[] = [
    'Support Technique',
    'Problème de Facturation',
    'Demande de Fonctionnalité',
    'Autre'
  ];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private contactService:ContactService) {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      subject:['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }
  
  submitForm() {
    if (this.formGroup.valid) {
      this.isLoading = true;
      const contactRequest = this.formGroup.value as ContactRequest;
      this.contactService.sendEmail(contactRequest).pipe(takeUntil(this.destroy$)).subscribe({
        next: (message) => {
          this.snackBar.open(message.message, 'Fermer', {duration: 3000})
          this.isLoading = false;
          this.formGroup.reset();
        }
      })
    } else {
      this.isLoading = false;
      this.errorMessage = "Veuillez remplir tous les champs correctement.";
    }
  }
  public back() {
    window.history.back();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

