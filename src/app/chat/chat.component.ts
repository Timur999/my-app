import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SignalrService } from '../_services/signalr.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { ChatService } from '../_services/chat.service';
import { ConfirmationService } from '../_dialogs/confirmation-dialog/confirmation-service.service';
import { CreatechatDialogService } from '../_dialogs/create-chat-dialog/createchat-dialog.service';

import { Message } from '../model/message';
import { error } from 'util';
import { Chat } from '../model/chat';


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
  isAdminChat = false;
  chat: Chat;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private route: ActivatedRoute,
    public signalrService: SignalrService,
    public chatService: ChatService,
    public formBuilder: FormBuilder,
    public router: Router,
    public breakpointObserver: BreakpointObserver,
    public confirmationService: ConfirmationService,
    public createchatDialogService: CreatechatDialogService) {
    this.currentUserName = sessionStorage.getItem("userName");
  }

  ngOnInit() {
    this.chatForm = this.formBuilder.group({
      userMessage: ['', [Validators.required, Validators.maxLength(250)]]
    })

    this.getMessagesChat();
    this.getChatMembersId(this.chatId);
    this.GetChatInfo(this.chatId)

    this.messages = this.signalrService.allMessages;

    this.signalrService.startConnection();
    this.signalrService.startEventListener(this.chatId);
  }

  GetChatInfo(chatId: number) {
    this.chatService.GetChatInfo(chatId).subscribe(
      data => {
      this.chat = data
        console.log(this.chat.ChatAdminId)
        if (this.chat.ChatAdminId == null) {
          this.chat.ChatAdminId = "";
          this.isAdminChat = false;
        } else {
          this.isAdminChat = true;
          this.chat.ChatAdminId = "true";
        }
        console.log(this.chat.ChatAdminId)
      },
      error => { console.log(error) })
  }

  getMessagesChat() {
    var msgs: Message[] = [];
    const id = this.route.snapshot.paramMap.get('id');
    this.chatId = parseInt(id);

    this.chatService.getMessagesFromChatById(parseInt(id)).subscribe(data => {
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
    this.chatService.sendMessageToChat(mess).subscribe(
      data => {
        // console.log("successChatService");
      }, error => { console.log("errorChatService") })

    this.chatForm.reset();
  }

  openDialog() {
    this.confirmationService.openConfirmDeleteChatDialog("Confirm", "Are you sure?", this.chatId)
  }

  openDialogLeaveChat() {
    this.confirmationService.openConfirmDialogLeaveChat("Confirm", "Are you sure?", this.chatId)
  }

  openDialogAddNewMemberChat() {
    this.createchatDialogService.openAddNewMemeberToChatDialog(this.chatId, "Choose your frends and add theirs to chat");
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    if (this.subscription != undefined)
      this.subscription.unsubscribe();
  }

}









