import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Event } from '../model/event';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  readonly rootUrl = "http://trletsrun.azurewebsites.net";
  eventsSubject: BehaviorSubject<Event[]>
  eventsObser: Observable<Event[]>;
  eventlist: Event[] = [];

  constructor(public httpClient: HttpClient) {
    this.eventsSubject = new BehaviorSubject<Event[]>(this.eventlist);
    this.eventsObser = this.eventsSubject.asObservable();
  }

  getAllEventsToListComponent(): Observable<Event[]>{
    return this.httpClient.get<Event[]>(this.rootUrl + "/api/Events");
  }

  getAllEvents(skipEventPost: number): Observable<Event[]> {
    return this.httpClient.get<Event[]>(this.rootUrl + "/api/Events/" + skipEventPost);
  }


  postEvent(formField: any): Observable<any> {
    const formData = new FormData();
    if (formField.eventImage != null) {
      formData.append("Image", formField.eventImage, formField.eventImage.name);
    }
    formData.append("Text", formField.eventText);
    formData.append("EventDate", formField.eventDate);
    formData.append("EventName", formField.eventName);

    return this.httpClient.post<any>(this.rootUrl + "/api/Events", formData).pipe(map((val: Event) => {
      val.Users = [];
      this.eventlist.unshift(val);
      this.eventsSubject.next(this.eventlist);
    }));;
  }

  putSubscriptionEventPost(eventId: number, ): Observable<any> {
    return this.httpClient.put<any>(this.rootUrl + "/api/SubscriptionEvents/" + eventId, '');
  }

  putEditEventPost(eventId: number, formField: any): Observable<any> {
    const formData = new FormData();
    console.log(formField);
    if (formField.eventImage != null) {
      formData.append("Image", formField.eventImage, formField.eventImage.name);
    }
    formData.append("Text", formField.eventText);
    formData.append("EventDate", formField.eventDate);
    formData.append("EventName", formField.eventName);
    return this.httpClient.put<any>(this.rootUrl + "/api/Events/" + eventId, formData);
  }

  deleteEventPost(eventId: number): Observable<any> {
    return this.httpClient.delete<any>(this.rootUrl + "/api/DeleteEvent/" + eventId);
  }

  public get postList(): Event[] {
    return this.eventsSubject.value;
  }

  UpdateEventList(eventId: number) {
    this.eventlist.forEach(element => {
      if (element.Id == eventId) {
        var index = this.eventlist.indexOf(element);
        this.eventlist.splice(index, 1);
      }
    });
    this.eventsSubject.next(this.eventlist);
  }
}
