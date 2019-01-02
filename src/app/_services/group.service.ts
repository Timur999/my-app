import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Group } from '../model/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  readonly rootUrl = "http://localhost:62747";
  constructor(private httpClient: HttpClient) { }

  getFirstFiveGroup() :Observable<any>{
    return this.httpClient.get(this.rootUrl + "/api/five`groups");
  }

  getGroupById(id: number) :Observable<Group>{
    return this.httpClient.get<Group>(this.rootUrl + "/api/Groups/" + id);
  }

  getValue():Observable<any>{
    return this.httpClient.get((this.rootUrl+"/api/values"));
  }
}
