import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Post } from '../model/post';
import { Message } from '../model/message'

@Injectable({
  providedIn: 'root'
})
export class PostService {

  readonly rootUrl = "http://localhost:62747";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
  };
  httpOptionsFile = {
    headers: new HttpHeaders({
      'Content-Type': '*',
      'Accept': '*'
    })
  }

  constructor(private httpClient: HttpClient) { }

  getPostById(id: number): Observable<any> {
    return this.httpClient.get(this.rootUrl + "/api/PostByGroup/" + id);
  }

  getNextTenPostBelongToGroup(id: number, numberOfPage: number): Observable<any> {
    return this.httpClient.get(this.rootUrl + "/api/Posts/" + id + "/" + numberOfPage);
  }

  postPost(Text: string, blogId: number): Observable<Post> {
    let body: Post = {
      Text: Text,
      BlogId: blogId
    }
    return this.httpClient.post<Post>(this.rootUrl + "/api/Posts", body, this.httpOptions);
  }

  postPostMessageAndImage(formField: any, blogId: number) {
    const formData = new FormData();
    if (formField.userImage != null) {
      formData.append("Image", formField.userImage, formField.userImage.name);
    }
    formData.append("Text", formField.userMessage);
    formData.append("BlogId", blogId.toString());

    return this.httpClient.post<any>(this.rootUrl + "/api/PostImage", formData);
  }

  //Edit post
  putPost(formField: any, postId: number): Observable<any> {
    const formData = new FormData();
    if (formField.image != null) {
      formData.append("Image", formField.image, formField.image.name);
    }
    formData.append("Text", formField.userMessage);
    formData.append("PostId", postId.toString());

    return this.httpClient.put<any>(this.rootUrl + "/api/EditPost", formData);
  }

  //Delete post
  deletePost(idPost: number): Observable<any> {
    return this.httpClient.delete<any>(this.rootUrl + "/api/Posts/" + idPost);
  }

}
