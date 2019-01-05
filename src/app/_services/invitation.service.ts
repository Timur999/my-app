import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Invitation } from '../model/invitation';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  readonly rootUrl = "http://localhost:62747";
  constructor(private httpClient: HttpClient) { }

  postInvitation(invitationList: Invitation[]): Observable<any> {
    return this.httpClient.post(this.rootUrl + "/api/Invitations", invitationList);
  }
}