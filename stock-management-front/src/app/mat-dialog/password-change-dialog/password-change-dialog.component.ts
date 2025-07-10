import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-password-change-dialog',
  imports: [MatDialogActions, MatDialogContent],
  templateUrl: './password-change-dialog.component.html',
  styleUrl: './password-change-dialog.component.scss'
})
export class PasswordChangeDialogComponent {
  constructor(private dialogRef: MatDialogRef<PasswordChangeDialogComponent> ) { }

  redirectToChangePassword(): void {
    this.dialogRef.close('redirect');
  }

}
