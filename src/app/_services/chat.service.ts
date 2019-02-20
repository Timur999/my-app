import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Chat } from '../model/chat';
import { Message } from '../model/message';
import { Root } from '../model/root';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatsCreatedByUserSubject: BehaviorSubject<Chat[]>
  chatsCreatedByUserObser: Observable<Chat[]>;
  chatlist: Chat[] = [];
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
  };

  readonly rootUrl = Root.rootUrl;
  constructor(public httpClient: HttpClient) {
    this.chatsCreatedByUserSubject = new BehaviorSubject<Chat[]>(this.chatlist);
    this.chatsCreatedByUserObser = this.chatsCreatedByUserSubject.asObservable();
  }

  sendMessageToChat(msg: Message): Observable<Message> {
    return this.httpClient.post<any>(this.rootUrl + "/api/PostMessage/", msg);
  }

  getMessagesFromChatById(chatId: number): Observable<Message[]> {
    return this.httpClient.get<any>(this.rootUrl + "/api/Chat/" + chatId);
  }

  getChatByMemberChat(chatMemberId: string): Observable<any> {
    return this.httpClient.get<any>(this.rootUrl + "/api/GetChatByMember/" + chatMemberId);
  }

  getChatMembers(chatId: number): Observable<string[]> {
    return this.httpClient.get<string[]>(this.rootUrl + "/api/GetChatsMembers/" + chatId);
  }

  GetChatInfo(chatId: number): Observable<Chat> {
    return this.httpClient.get<Chat>(this.rootUrl + "/api/GetChatInfo/" + chatId);
  }

  postChat(chat: Chat): Observable<any> {
    return this.httpClient.post<number>(this.rootUrl + "/api/Chat/", chat).pipe(map((val: number) => {
      chat.Id = val;
      this.chatlist.push(chat);
      this.chatsCreatedByUserSubject.next(this.chatlist);
    }));
  }

  getChatsCreatedByUser(): Observable<Chat[]> {
    return this.httpClient.get<Chat[]>(this.rootUrl + "/api/GetChatsCreatedByUser");
  }

  deleteChatById(chatId: number): Observable<any> {
    return this.httpClient.delete<any>(this.rootUrl + "/api/Chat/" + chatId);
  }

  putLeaveTheChat(chatId: number): Observable<any> {
    return this.httpClient.put<any>(this.rootUrl + "/api/PutLeaveTheChat/" + chatId, this.httpOptions);
  }

  putAddNeMembersChat(chatId: number, userIdList: string[]): Observable<any> {
    console.log("helo")
    return this.httpClient.put<any>(this.rootUrl + "/api/PutAddNewMemberToChat/" + chatId, userIdList, this.httpOptions);
  }

  public get usersChatList(): Chat[] {
    return this.chatsCreatedByUserSubject.value;
  }

  UpdateChatsList(chatId: number) {
    this.chatlist.forEach(element => {
      if (element.Id == chatId) {
        var index = this.chatlist.indexOf(element);
        this.chatlist.splice(index, 1);
      }
    });
    this.chatsCreatedByUserSubject.next(this.chatlist);
  }
}
