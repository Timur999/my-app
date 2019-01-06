import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EventDialogComponent } from './event-dialog.component'
import { EventsService } from '../../_services/events.service';
import { AlertService } from '../../_services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class EventDialogService {

  constructor(public matDialog: MatDialog,
    public eventsService: EventsService,
    public alertService: AlertService) { }

  openCreateEventsDialog(title: string, message: string, userName: string) {
    const dialogRef = this.matDialog.open(EventDialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != '') {
        this.eventsService.postEvent(result).subscribe(
          data => {
            this.alertService.success("Successful", true);
          },
          error => {
            this.alertService.error(error);
          }
        )
      }
    });
  }
}
