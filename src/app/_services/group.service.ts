import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group } from '../model/group';
import { Root } from '../model/root';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  groupsSubject: BehaviorSubject<Group[]>
  groupsObser: Observable<Group[]>;
  usersGrouplist: Group[] = [];

  readonly rootUrl = Root.rootUrl;
  constructor(public httpClient: HttpClient) {
    this.groupsSubject = new BehaviorSubject<Group[]>(this.usersGrouplist);
    this.groupsObser = this.groupsSubject.asObservable();
  }

  getFirstFiveGroup(): Observable<any> {
    return this.httpClient.get(this.rootUrl + "/api/fivegroups");
  }

  getGroupById(id: number): Observable<Group> {
    return this.httpClient.get<Group>(this.rootUrl + "/api/Groups/" + id);
  }

  getGroupAll(): Observable<Group[]> {
    return this.httpClient.get<Group[]>(this.rootUrl + "/api/Groups/");
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
        this.usersGrouplist.unshift(val);
        this.groupsSubject.next(this.usersGrouplist);
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
    this.usersGrouplist.forEach(element => {
      if (element.Id == groupId) {
        var index = this.usersGrouplist.indexOf(element);
        this.usersGrouplist.splice(index, 1);
      }
    });
    this.groupsSubject.next(this.usersGrouplist);
  }

}
