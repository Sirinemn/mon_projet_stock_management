import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageResponse } from '../shared/models/messageResponse';
import { ContactRequest } from '../shared/models/contactRequest';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) { }

  public sendEmail(contactRequest: ContactRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(this.apiUrl, contactRequest)
  }
}
