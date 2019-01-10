import { Injectable } from '@angular/core';
import { BroadcastEventListener, SignalR, SignalRConnection } from 'ng2-signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../model/message';
import { UserService } from './user.service';


@Injectable({
    providedIn: 'root'
})
export class SignalrService {
    currentUserName: string;
    messagesSubject: BehaviorSubject<Message[]>
    messagesObser: Observable<Message[]>;
    messages: Message[] = [];
    message: Message;

    public _connection: SignalRConnection;
    onMessageSent$: BroadcastEventListener<Message>;
    constructor(public _signalR: SignalR, public userService: UserService) {
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

    startEventListener(chatRoomId: number) {
        this.onMessageSent$ = new BroadcastEventListener<Message>('OnMessageSent');
        this._connection.listen(this.onMessageSent$);
        this.onMessageSent$.subscribe((chatMessage: Message) => {
            if(chatMessage.ChatId == chatRoomId){
                this.messages.push(chatMessage);
                this.messagesSubject.next(this.messages);
            }
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
