import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Event } from '../model/event';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  readonly rootUrl = "http://localhost:62747";
  eventsSubject: BehaviorSubject<Event[]>
  eventsObser: Observable<Event[]>;
  eventlist: Event[] = [];

  constructor(private httpClient: HttpClient) {
    this.eventsSubject = new BehaviorSubject<Event[]>(this.eventlist);
    this.eventsObser = this.eventsSubject.asObservable();
   }

  getAllPost(skipEventPost: number): Observable<Event[]>{
    return this.httpClient.get<Event[]>(this.rootUrl + "/api/Events/" + skipEventPost);
  }


  postEvent(formField: any) :Observable<any>  {
    const formData = new FormData();
    console.log(formField);
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

  putSubscriptionEventPost(eventId: number, ) :Observable<any>{
    return this.httpClient.put<any>(this.rootUrl + "/api/SubscriptionEvents/" + eventId, '' );
  }
  public get postList(): Event[] {
    return this.eventsSubject.value;
  }

  UpdatePostList(eventId: number) {
    this.eventlist.forEach(element => {
      if (element.Id == eventId) {
        var index = this.eventlist.indexOf(element);
        this.eventlist.splice(index, 1);
      }
    });
    this.eventsSubject.next(this.eventlist);
  }
}
