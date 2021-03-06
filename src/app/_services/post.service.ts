import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../model/post';
import { Root } from '../model/root';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postsSubject: BehaviorSubject<Post[]>
  postsObser: Observable<Post[]>;
  postlist: Post[] = [];

  readonly rootUrl = Root.rootUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
  };
  httpOptionsFile = {
    headers: new HttpHeaders({
      'Content-Type': '*',
      'Accept': '*'
    })
  }

  constructor(public httpClient: HttpClient) {
    this.postsSubject = new BehaviorSubject<Post[]>(this.postlist);
    this.postsObser = this.postsSubject.asObservable();
   }

  getPostById(id: number): Observable<any> {
    return this.httpClient.get(this.rootUrl + "/api/PostByGroup/" + id);
  }

  getNextTenPostBelongToGroup(id: number, numberOfPage: number): Observable<any> {
    return this.httpClient.get(this.rootUrl + "/api/Posts/" + id + "/" + numberOfPage);
  }

  postPostMessageAndImage(formField: any, blogId: number) :Observable<any> {
    const formData = new FormData();
    if (formField.userImage != null) {
      formData.append("Image", formField.userImage, formField.userImage.name);
    }
    formData.append("Text", formField.userMessage);
    formData.append("BlogId", blogId.toString());

    return this.httpClient.post<any>(this.rootUrl + "/api/PostImageToAzure", formData).pipe(map((val: Post ) => {
      this.postlist.unshift(val);
      this.postsSubject.next(this.postlist);
     // console.log(this.postlist);
    }));;
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


  public get postList(): Post[] {
    return this.postsSubject.value;
  }

  
  UpdatePostList(postId: number) {
    this.postlist.forEach(element => {
      if (element.Id == postId) {
        var index = this.postlist.indexOf(element);
        this.postlist.splice(index, 1);
      }
    });
    this.postsSubject.next(this.postlist);
  }

}
