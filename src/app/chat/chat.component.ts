import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SignalrService } from '../_services/signalr.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router'

import { ChatService } from '../_services/chat.service';

import { Message } from '../model/message';
import { Chat } from '../model/chat'


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  subscription: Subscription

  chatForm: FormGroup;

  currentUserName: string;
  messages: Message[] = [];
  message: Message;
  userMessage: string;
  chatId: number;
  membersId: string[] = [];

  constructor(private route: ActivatedRoute,
    public signalrService: SignalrService,
    public chatService: ChatService,
    public formBuilder: FormBuilder,
    public router: Router) {
    this.currentUserName = sessionStorage.getItem("userName");
  }

  ngOnInit() {
    this.chatForm = this.formBuilder.group({
      userMessage: ['', [Validators.required, Validators.maxLength(250)]]
    })

    this.getChat();
    this.getChatMembersId(this.chatId);
    this.messages = this.signalrService.allMessages;

    this.signalrService.startConnection();
    this.signalrService.startEventListener();
  }

  getChat() {
    var msgs: Message[] = [];
    const id = this.route.snapshot.paramMap.get('id');
    this.chatService.getChatById(parseInt(id)).subscribe(data => {
      msgs = data;
      msgs.forEach(msg => {
        this.messages.push(msg);
      });
    },
      error => {
        console.log("getChat error " + error)
        if (error == 'Forbidden') {
          this.router.navigate(['/forbidden']);
          console.log("redirect to page forbidden");
        }
      });

    this.chatId = parseInt(id);
  }

  getChatMembersId(chatId: number) {
    this.chatService.getChatMembers(chatId).subscribe(
      listOfMember => { this.membersId = listOfMember; },
      error => { console.log("error getChatMembersId " + error) }
    )
  }

  sendChatMessage() {
    if (this.chatForm.invalid) {
      return;
    }
    var mess = new Message(this.chatId, this.chatForm.value.userMessage, this.currentUserName, this.membersId);
    this.signalrService.sendMessage(mess);
    this.chatService.sendMessageToChat(mess).subscribe(data => {
      // console.log("successChatService");
    }, error => { console.log("errorChatService") })

    this.chatForm.reset();
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    if (this.subscription != undefined)
      this.subscription.unsubscribe();
  }

}









