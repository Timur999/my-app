import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Message } from '../model/message'

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly rootUrl = "http://localhost:62747";
  constructor(private httpClient: HttpClient) { }

  sendMessageToChat(msg: Message) :Observable<Message>{
    return this.httpClient.post<any>(this.rootUrl + "/api/PostMessage/", msg);
  }

  getChatById(chatId: number) :Observable<Message[]>{
    return this.httpClient.get<any>(this.rootUrl + "/api/Chat/" + chatId );
  }

  getChatByMemberChat(chatMemberId: string) :Observable<any>{
    return this.httpClient.get<any>(this.rootUrl + "/api/GetChatByMember/"+ chatMemberId);
  }

  getChatMembers(chatId: number) :Observable<string[]>{
    return this.httpClient.get<string[]>(this.rootUrl + "/api/GetChatsMembers/" + chatId);
  }
}
