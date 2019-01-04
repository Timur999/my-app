import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateChatDialogComponent } from '../create-chat-dialog/create-chat-dialog.component'
import { Chat } from 'src/app/model/chat';
import { ChatService } from '../../_services/chat.service'
import { AddNewMemebersToChatDialogComponent } from '../add-new-memebers-to-chat-dialog/add-new-memebers-to-chat-dialog.component'


@Injectable({
  providedIn: 'root'
})
export class CreatechatDialogService {

  constructor(public matDialog: MatDialog,
    public chatService: ChatService) { }

  openDialog() {
    const dialogRef = this.matDialog.open(CreateChatDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result == '')
        return;

      let listOfUserId: string[] = [];
      result.users.forEach(element => {
        listOfUserId.push(element.Id);
      });
      var chat = new Chat(result.chatName, "", listOfUserId);

      this.chatService.postChat(chat).subscribe(
        data => { console.log(data) },
        error => { console.log(error) }
      )
    });
  }

  openAddNewMemeberToChatDialog(chatId: number) {
    const dialogRef = this.matDialog.open(AddNewMemebersToChatDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result == '')
        return;

      let listOfUserId: string[] = [];
      result.users.forEach(element => {
        listOfUserId.push(element.Id);
      });

      this.chatService.putAddNeMembersChat(chatId, listOfUserId).subscribe(
        data => { console.log(data) },
        error => { console.log(error) }
      )
    });
  }
}
