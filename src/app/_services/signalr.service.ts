import { Injectable } from '@angular/core';
import { SignalR, SignalRConnection, ConnectionStatus, BroadcastEventListener } from 'ng2-signalr';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { UserService } from './user.service';

import { Message } from '../model/message';


@Injectable({
    providedIn: 'root'
})
export class SignalrService {
    currentUserName: string;
    messagesSubject: BehaviorSubject<Message[]>
    messagesObser: Observable<Message[]>;
    messages: Message[] = [];
    message: Message;

    private _connection: SignalRConnection;
    onMessageSent$: BroadcastEventListener<Message>;
    constructor(private _signalR: SignalR, private userService: UserService) {
        this.currentUserName = sessionStorage.getItem("userName");
        this.messagesSubject = new BehaviorSubject<Message[]>(this.messages);
    }

    startConnection() {
        let conx = this._signalR.createConnection();
        conx.status.subscribe((s) => console.warn(s.name));
        conx.start()
            .then((c) => {
                console.log('Connection started!');
                this.registerUser("")
            })
            .catch(err => console.log('Error while establishing connection :('));
        this._connection = conx;
    }

    startEventListener() {
        this.onMessageSent$ = new BroadcastEventListener<Message>('OnMessageSent');
        this._connection.listen(this.onMessageSent$);
        this.onMessageSent$.subscribe((chatMessage: Message) => {
            this.messages.push(chatMessage);
            this.messagesSubject.next(this.messages);
        });
    }

    sendMessage(msg: Message) {
        this._connection.invoke('SendMessage', msg)
            .then((data: Message) => console.log("success"))
            .catch((err: any) => console.log('Failed to invoke \'Send\'. Error occured. Error:' + err));
    }

    registerUser(userId: string) {
        this.userService.getUserId().subscribe(
            userId => this._connection.invoke('RegisterUser', userId)
                .then((data: Message) => console.log("success registerUser"))
                .catch((err: any) => console.log('Failed to invoke \'registerUser\'. Error occured. Error:' + err)),
            error => { console.log("error while getting user ID " + error) }
        )
    }

    public get allMessages(): Message[] {
        return this.messagesSubject.value;
    }


}
//statuscode
  //  statuses: ConnectionStatus[];
  //   this._connection.status.subscribe((status: ConnectionStatus) => {
  //     console.log(status);
  //   // this.statuses.push(status);
  // });

//other listener
  // let onMessageSent$ = this._connection.listenForRaw('Ng2SignalRHub');
  // onMessageSent$.subscribe((result) => {console.log("result")});
