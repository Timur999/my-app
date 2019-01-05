import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';
import { GroupService } from '../../_services/group.service';
import { InvitationService } from '../../_services/invitation.service';
import { Invitation } from '../../model/invitation';
import { AddNewMemebersDialogComponent } from '../add-new-memebers-dialog/add-new-memebers-dialog.component';
import { AlertService } from '../../_services/alert.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component'
import { Router } from '@angular/router'
import { Group } from 'src/app/model/group';

@Injectable({
  providedIn: 'root'
})
export class GroupdialogService {

  invitationList: Invitation[] = [];
  groupList: Group[] = [];

  constructor(public matDialog: MatDialog,
    public groupService: GroupService,
    public invitationService: InvitationService,
    private alertService: AlertService,
    private router: Router) { }

  openCreateGroupDialog(title: string, message: string) {
    const dialogRef = this.matDialog.open(CreateGroupDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result == '')
        return;

      this.groupList = this.groupService.grouplist;

      let listOfUserId: string[] = [];
      result.users.forEach(element => {
        listOfUserId.push(element.Id);
      });

      this.groupService.postGroup(result.groupName, listOfUserId).subscribe(
        data => {
          for (var i = 0; i < listOfUserId.length; i++) {
            var invite: Invitation = {
              GroupId: this.groupList[0].Id,
              GroupsName: this.groupList[0].GroupsName,
              UserIdReceiver: listOfUserId[i]
            };
            this.invitationList.push(invite)
          }
          this.invitationService.postInvitation(this.invitationList).subscribe(
            data => { console.log("Success save invitation") },
            error => { console.log(error + " while save invitation") }
          )
          this.invitationList = [];
        },
        error => { console.log(error) }
      )
    });
  }


  openAddNewMemberDialog(groupId: number, message: string) {
    const dialogRef = this.matDialog.open(AddNewMemebersDialogComponent);
    dialogRef.componentInstance.message = message;

    dialogRef.afterClosed().subscribe(result => {
      if (result == '')
        return;

      let listOfUserId: string[] = [];
      result.users.forEach(element => {
        listOfUserId.push(element.Id);
      });

      for (var i = 0; i < listOfUserId.length; i++) {
        var invite: Invitation = {
          GroupId: groupId,
          GroupsName: '',
          UserIdReceiver: listOfUserId[i]
        };
        this.invitationList.push(invite)
      }
      this.invitationService.postInvitation(this.invitationList).subscribe(
        data => { this.alertService.success("Success"); },
        error => { this.alertService.error(error); }
      )
      this.invitationList = [];
    });
  }

  openConfirmLeaveGroupDialog(groupId: number, title: string, message: string) {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result == true) {
        this.groupService.putLeaveGroup(groupId).subscribe(
          data => {
            this.alertService.success("Successful", true);
            this.groupService.UpdateGroupList(groupId);
            this.router.navigate(["./home"]);
          },
          error => {
            this.alertService.error(error);
          })
      }
    })
  }


  openConfirmDeleteDialog(groupId: number, title: string, message: string) {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result == true) {
        this.groupService.deleteGroup(groupId).subscribe(
          data => {
            this.alertService.success("Successful", true);
            this.groupService.UpdateGroupList(groupId);
            this.router.navigate(["./home"]);
          },
          error => {
            this.alertService.error(error);
          })
      }
    })
  }

}

