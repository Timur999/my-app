import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../model/comment';
import { Root } from '../model/root';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  readonly rootUrl = Root.rootUrl;
  constructor(public httpClient: HttpClient) { }

  getCommentsByGroup(groupId: number): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(this.rootUrl + "/api/GetComments/" + groupId);
  }

  postComment(comment: Comment): Observable<any> {
    console.log(comment)
    return this.httpClient.post<any>(this.rootUrl + "/api/PostComment", comment);
  }
}
