import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    readonly rootUrl = "http://trletsrun.azurewebsites.net";
    public currentUserSubject: BehaviorSubject<string>;
    public currentUser: Observable<string>;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*'
        })
    };
    constructor(public http: HttpClient) {
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
