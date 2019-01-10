import { Injectable } from '@angular/core';
import { Comment } from '../model/comment'
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  readonly rootUrl = "http://trletsrun.azurewebsites.net";
  constructor(private httpClient: HttpClient) { }

  getCommentsByGroup(groupId: number): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(this.rootUrl + "/api/GetComments/" + groupId);
  }

  postComment(comment: Comment) :Observable<any>{
    console.log(comment)
    return this.httpClient.post<any>(this.rootUrl + "/api/PostComment", comment);
  }
}
