import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../model/event';
import { EventDialogService } from '../_dialogs/event-dialog/event-dialog.service';
import { AlertService } from '../_services/alert.service';
import { EventsService } from '../_services/events.service';
import { ConfirmationService } from '../_dialogs/confirmation-dialog/confirmation-service.service'

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  EditEventForm: FormGroup;
  events: Event[] = [];
  event: Event;
  tenEventList: any;
  currentUserName: string;
  lengthArray: number;
  editEventId: number;
  image: File;
  loading: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  constructor(private breakpointObserver: BreakpointObserver,
    private eventDialogService: EventDialogService,
    private eventsService: EventsService,
    private alertService: AlertService,
    public fb: FormBuilder,
    private confirmationService: ConfirmationService ) { }

  ngOnInit() {
    this.EditEventForm = this.fb.group({
      eventName: ['', [Validators.required, Validators.maxLength(100)]],
      eventText: ['', [Validators.required, Validators.maxLength(250)]],
      eventDate: ['', Validators.required],
      eventImage: ['']
    })

    this.currentUserName = sessionStorage.getItem("userName");
    this.getAllEvents();
    this.events = this.eventsService.eventlist;
    console.log(this.events)
  }

  getAllEvents() {
    this.eventsService.getAllEvents(0).subscribe(
      data => {
        var tempEventList = data;
        this.lengthArray = tempEventList.length > 0 ? tempEventList[0].ArrayLength : 0;
        tempEventList.forEach(element => {
          this.events.push(element)
        });
      },
      error => {
        this.alertService.error(error)
        console.log(error)
      }
    )
  }

  openAddEventDialog() {
    this.eventDialogService.openCreateEventsDialog("Creator events", "Write name of event, please", this.currentUserName);
  }

  nextPageEvent($event) {
    console.log($event)
    this.eventsService.getAllEvents($event.pageIndex).subscribe(
      data => {
        this.events.length = 0;
        var tempEventList = data;
        this.lengthArray = tempEventList[0].ArrayLength;
        tempEventList.forEach(element => {
          this.events.push(element)
        });
        document.querySelector('.mat-sidenav-content').scrollTop = 0;
      },
      error => { this.alertService.error(error) });
  }

  Subscription(eventPost: Event) {
    this.eventsService.putSubscriptionEventPost(eventPost.Id).subscribe(
      data => {
        var element = this.events.find(val => val.Id == eventPost.Id);
        if (data.IsSubscribe)
          element.Users.push(data);
        else {
          var indexUser = element.Users.findIndex(val => val.Id == data.Id);
          element.Users.splice(indexUser, 1);
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  EditEvent(event: Event) {
    //Show/Hide edit fields 
    event.isEdit = !event.isEdit
    this.editEventId = event.Id;
  }

  OnSubmitEditForm(event: Event) {
    if (this.EditEventForm.valid) {
      this.loading = true;
      this.EditEventForm.value.eventImage = this.image;

      this.eventsService.putEditEventPost(event.Id, this.EditEventForm.value)
        .subscribe(
          data => {
            var indexEditEvent = this.events.indexOf(event);
            this.events.splice(indexEditEvent, 1, data);
            this.alertService.success("Successful", true);
            this.loading = false;
            event.isEdit = false;
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
            event.isEdit = false;
          }
        )
    }
  }
  deleteEventPost
  DeleteEvent(event) {
    this.confirmationService.openConfirmDialogDeleteEventPost("Confirm", "Are you sure?", event.Id);
  }

  onFileSelected(event) {
    this.image = event.target.files[0];
  }

}
