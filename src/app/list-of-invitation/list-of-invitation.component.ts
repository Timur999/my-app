import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { InvitationService } from '../_services/invitation.service';
import { AlertService } from '../_services/alert.service';
import { Invitation } from '../model/invitation';

@Component({
  selector: 'app-list-of-invitation',
  templateUrl: './list-of-invitation.component.html',
  styleUrls: ['./list-of-invitation.component.css']
})
export class ListOfInvitationComponent implements OnInit {


  invites: Invitation[] = [];
  displayedColumns: string[] = ['Position', 'GroupsName', 'UserNameSender', 'Id'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private invitationService: InvitationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.getAllInvitations();
  }

  getAllInvitations() {
    this.invitationService.getAllInvitationBelongToUser().subscribe(
      data => {
        this.invites = data;
        var index = 1;
        this.invites.forEach(element => {
          element.Position = index++;
        });
        this.dataSource = new MatTableDataSource<Invitation>(this.invites);
        this.dataSource.paginator = this.paginator;
      },
      error => { this.alertService.error(error) }
    )
  }


  acceptInvitation(invitation) {
    invitation.IsAccepted = true;
    this.putInvitationOnServer(invitation);
  }

  denyInvitation(invitation) {
    invitation.IsAccepted = false;
    this.putInvitationOnServer(invitation);
  }


  putInvitationOnServer(invitation: Invitation){
    this.invitationService.putInvitation(invitation).subscribe(
      data => { this.removeRow(invitation) },
      error => { console.log(error) }
    )
  }

  removeRow(value: Invitation) {
    this.invites.splice(value.Position - 1, 1)
    var index = 1;
    this.invites.forEach(element => {
      element.Position = index++;
    });
    this.dataSource = new MatTableDataSource<Invitation>(this.invites);
  }


}
