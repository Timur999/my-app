import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../model/message'
import { Chat } from '../model/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatsCreatedByUserSubject: BehaviorSubject<Chat[]>
  chatsCreatedByUserObser: Observable<Chat[]>;
  chatlist: Chat[] = [];

  readonly rootUrl = "http://localhost:62747";
  constructor(private httpClient: HttpClient) {
    this.chatsCreatedByUserSubject = new BehaviorSubject<Chat[]>(this.chatlist);
    this.chatsCreatedByUserObser = this.chatsCreatedByUserSubject.asObservable();
  }

  sendMessageToChat(msg: Message): Observable<Message> {
    return this.httpClient.post<any>(this.rootUrl + "/api/PostMessage/", msg);
  }

  getChatById(chatId: number): Observable<Message[]> {
    return this.httpClient.get<any>(this.rootUrl + "/api/Chat/" + chatId);
  }

  getChatByMemberChat(chatMemberId: string): Observable<any> {
    return this.httpClient.get<any>(this.rootUrl + "/api/GetChatByMember/" + chatMemberId);
  }

  getChatMembers(chatId: number): Observable<string[]> {
    return this.httpClient.get<string[]>(this.rootUrl + "/api/GetChatsMembers/" + chatId);
  }

  postChat(chat: Chat): Observable<any> {
    return this.httpClient.post<number>(this.rootUrl + "/api/Chat/", chat).pipe(map((val: number) => {
      this.chatlist.push(chat);
      this.chatsCreatedByUserSubject.next(this.chatlist);
    }));
  }

  getChatsCreatedByUser(): Observable<Chat[]> {
    return this.httpClient.get<Chat[]>(this.rootUrl + "/api/GetChatsCreatedByUser");
  }

  public get usersChatList(): Chat[] {
    console.log("this.chatsCreatedByUserSubject.value " + this.chatsCreatedByUserSubject.value)
    return this.chatsCreatedByUserSubject.value;
  }
}
