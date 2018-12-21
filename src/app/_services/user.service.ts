import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../model/user';

@Injectable()
export class UserService {
    readonly rootUrl = "http://localhost:62747";
    
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`/users`);
    }

    getById(id: number) {
        return this.http.get(`/users/` + id);
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