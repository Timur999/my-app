import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { EventDialogService } from '../_dialogs/event-dialog/event-dialog.service'
import { EventsService } from '../_services/events.service'
import { AlertService } from '../_services/alert.service'
import { Event } from '../model/event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: Event[] = [];
  event: Event;
  tenEventList: any;
  currentUserName: string;
  lengthArray: number;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  constructor(private breakpointObserver: BreakpointObserver,
    private eventDialogService: EventDialogService,
    private eventsService: EventsService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.currentUserName = sessionStorage.getItem("userName");
    this.getAllEvents();
    this.events = this.eventsService.eventlist;
    console.log(this.events)
  }

  getAllEvents() {
    this.eventsService.getAllPost(0).subscribe(
      data => {
        var tempEventList = data;
        this.lengthArray = tempEventList.length > 0 ? tempEventList[0].ArrayLength: 0;
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
    this.eventsService.getAllPost($event.pageIndex).subscribe(
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
        if(data.IsSubscribe)
          element.Users.push(data);
          else{
            var indexUser = element.Users.findIndex(val => val.Id == data.Id);
            element.Users.splice(indexUser, 1);
          }
      },
      error => { 
        console.log(error)
      }
    )
  }
}
