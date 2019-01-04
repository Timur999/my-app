import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from './confirmation-dialog.component'
import { PostService } from '../../_services/post.service'
import { AlertService } from '../../_services/alert.service';
import { ChatService } from '../../_services/chat.service';
import { Router } from '@angular/router'
import { error } from 'util';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  constructor(public matDialog: MatDialog,
    private postService: PostService,
    private alertService: AlertService,
    private chatService: ChatService,
    private router: Router) { }

  openConfirmDialog(title: string, message: string, postId: number) {

    const dialogRef = this.matDialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result == true) {
        this.postService.deletePost(postId).subscribe(
          data => {
            this.alertService.success("Successful", true);
          },
          error => {
            this.alertService.error(error);
          })
      }
    })
  }

  openConfirmDeleteChatDialog(title: string, message: string, chatId: number) {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result == true) {
        this.chatService.deleteChatById(chatId).subscribe(
          data => {
            this.alertService.success("Successful", true);
            this.chatService.UpdateChatsList(chatId);
            this.router.navigate(["./home"]);
          },
          error => {
            this.alertService.error(error);
          })
      }
    })
  }

  openConfirmDialogLeaveChat(title: string, message: string, chatId: number) {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result == true) {
        this.chatService.putLeaveTheChat(chatId).subscribe(
          data => {
            this.alertService.success("Successful", true);
            this.chatService.UpdateChatsList(chatId);
            this.router.navigate(["./home"]);
          },
          error => {
            this.alertService.error(error);
          })
      }
    })
  }

}


// dialogRef.beforeClose().subscribe(result => {
//   if (result != undefined && result != '') {
//     //this.subscriptionPost = this.postService.postPost(result.userMessage, 1).pipe(
//     this.postService.deletePost().subscribe(
//       data => {
//         // this.posts.push(data);
//         console.log(data);
//         this.result = "success";
//       },
//       error => {
//         this.result = "error";
//       }
//     )
//   }
// }