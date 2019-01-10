import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { EventsService } from '../_services/events.service';
import { AlertService } from '../_services/alert.service';
import { Event } from '../model/event';

@Component({
  selector: 'app-list-of-event',
  templateUrl: './list-of-event.component.html',
  styleUrls: ['./list-of-event.component.css']
})
export class ListOfEventComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'EventName', 'EventDate', 'IsAdmin', 'IsSubscriber', 'SubscriberCount'];
  dataSource: any;
  allEventsList: Event[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public eventsService: EventsService,
    public alertService: AlertService) { }

  ngOnInit() {
    this.getAllEvents();
  }

  getAllEvents() {
    this.eventsService.getAllEventsToListComponent().subscribe(
      data => {
        this.allEventsList = data;
        this.dataSource = new MatTableDataSource<Event>(this.allEventsList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        this.alertService.error(error);
      }
    )
  }

}
