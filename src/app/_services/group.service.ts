import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group } from '../model/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  groupsSubject: BehaviorSubject<Group[]>
  groupsObser: Observable<Group[]>;
  grouplist: Group[] = [];

  readonly rootUrl = "http://localhost:62747";
  constructor(private httpClient: HttpClient) {
    this.groupsSubject = new BehaviorSubject<Group[]>(this.grouplist);
    this.groupsObser = this.groupsSubject.asObservable();
  }

  getFirstFiveGroup(): Observable<any> {
    return this.httpClient.get(this.rootUrl + "/api/fivegroups");
  }

  getGroupById(id: number): Observable<Group> {
    return this.httpClient.get<Group>(this.rootUrl + "/api/Groups/" + id);
  }

  getUsersBelongToGroup(groupId): Observable<any> {
    return this.httpClient.get((this.rootUrl + "/api/Groups/" + groupId + "/Users"));
  }

  postGroup(groupName: string, userIdList: string[]): Observable<any> {
    let body: Group = {
      GroupsName: groupName,
      MembersOfGroup: userIdList
    }
    return this.httpClient.post<any>(this.rootUrl + "/api/Groups", body).pipe(
      map((val: Group) => {
        this.grouplist.unshift(val);
        this.groupsSubject.next(this.grouplist);
      }
      ));
  }

  putLeaveGroup(groupId: number): Observable<any>{
    return this.httpClient.put<any>(this.rootUrl + "/api/LeaveGroup/" + groupId, "" )
  }


  deleteGroup(groupId: number): Observable<any>{
    return this.httpClient.delete<any>(this.rootUrl + "/api/Groups/" + groupId )
  }

  public get userGroupList(): Group[] {
    return this.groupsSubject.value;
  }

  UpdateGroupList(groupId: number) {
    this.grouplist.forEach(element => {
      if (element.Id == groupId) {
        var index = this.grouplist.indexOf(element);
        this.grouplist.splice(index, 1);
      }
    });
    this.groupsSubject.next(this.grouplist);
  }

}
