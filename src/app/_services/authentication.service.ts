import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../model/user'

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    readonly rootUrl = "http://localhost:62747";
    public currentUserSubject: BehaviorSubject<string>;
    public currentUser: Observable<string>;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*'
        })
    };
    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<string>(JSON.parse(sessionStorage.getItem("tokenKey")));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    login(username: string, password: string) {
        const body = "username=" + username + "&password=" + password + "&grant_type=" + "password";
        return this.http.post<any>(this.rootUrl + `/token`, body, this.httpOptions).pipe(map(data => {
            sessionStorage.setItem("tokenKey", JSON.stringify(data.access_token));
            sessionStorage.setItem("userName", data.userName);
            this.currentUserSubject.next(JSON.parse(sessionStorage.getItem("tokenKey")));
        })
        );
    }

    logout() {
        // remove user from local storage to log user out
        this.currentUserSubject.next(null);
        sessionStorage.removeItem("tokenKey");
        sessionStorage.removeItem("userName");
    }

    public get currentUserValue(): string {
        return this.currentUserSubject.value;
    }
}
