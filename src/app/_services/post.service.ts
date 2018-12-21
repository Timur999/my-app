import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Post } from '../model/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  readonly rootUrl = "http://localhost:62747";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8'})
  };
  httpOptionsFile = {
    headers: new HttpHeaders({
      'Content-Type': '*',
      'Accept': '*'
    })
  }

  constructor(private httpClient: HttpClient) { }

  getPostById(id: number) :Observable<any>{
    return this.httpClient.get(this.rootUrl + "/api/PostByGroup/" + id);
  }

  getNextTenPostBelongToGroup(id: number, numberOfPage: number) :Observable<any>{
    return this.httpClient.get(this.rootUrl + "/api/Posts/" + id +"/"+ numberOfPage);
  }

  postPost(Text: string, blogId: number) :Observable<Post>{
    let body: Post = {
      Text: Text,
      BlogId: blogId
    }
    return this.httpClient.post<Post>(this.rootUrl + "/api/Posts", body, this.httpOptions);
  }

  postPostWithPhoto(fileToUpload: File) : Observable<any>{

    console.log(fileToUpload)
    const formData = new FormData();
    formData.append("Image", fileToUpload, fileToUpload.name);
    formData.append("Name", "Pumba");

    console.log(formData.getAll);
    return this.httpClient.post<any>(this.rootUrl + "/api/PostImage", formData );
  }

  postPostMessageAndImage(formField: any, blogId: number){
    const formData = new FormData();
    if(formField.userImage != null){
      formData.append("Image", formField.userImage, formField.userImage.name);
    }
    formData.append("Text", formField.userMessage);
    formData.append("BlogId", blogId.toString());

    return this.httpClient.post<any>(this.rootUrl + "/api/PostImage", formData );
  }
}
