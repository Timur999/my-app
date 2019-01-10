import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { User } from '../model/user';

@Injectable()
export class UserService {
    readonly rootUrl = "http://trletsrun.azurewebsites.net";

    constructor(public http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`/users`);
    }

    getShortListUser(): Observable<User[]> {
        return this.http.get<User[]>(this.rootUrl + "/api/getshortlistusers");
    }

    getByName(userName: string): Observable<User[]> {
        return this.http.get<User[]>(this.rootUrl + "/api/getusersbyname/" + userName);
    }

    getById(id: number) {
        return this.http.get(`/users/` + id);
    }

    getUserId() {
        return this.http.get(this.rootUrl +"/api/GetUserId");
    }

    register(user: User) {
        return this.http.post(this.rootUrl + "/api/Account/Register", user);
    }

    update(user: User) {
        return this.http.put(`/users/` + user.Id, user);
    }

    delete(id: number) {
        return this.http.delete(`/users/` + id);
    }
}