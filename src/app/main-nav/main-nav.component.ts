import { Component, Input } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AlertService } from '../_services/alert.service';
import { GroupService } from '../_services/group.service';
import { UserService } from '../_services/user.service';
import { ChatService } from '../_services/chat.service';

import { Group } from '../model/group';
import { User } from '../model/user';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
})
export class MainNavComponent {

  subscriptionGet: Subscription;

  // @Input() token: string;
  groups: Group[];
  searchForm: FormGroup;
  users: User[];
  currentUserName: string;
  user: User;
  chatId: number = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
    private groupService: GroupService,
    private alertService: AlertService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    public chatService: ChatService,
    public router: Router) { }

  ngOnInit() {
    this.getShortListOfUsersGroup();
    this.getShortListOfUser();

    this.searchForm = this.formBuilder.group({
      username: ['', Validators.required]
    });
    this.onChanges();
    this.currentUserName = sessionStorage.getItem("userName");
  }

  onChanges() {
    this.searchForm.get('username').valueChanges.subscribe(val => this.onSubmit(val))
  }

  Logout() {
    //this.authenticationService.logout();
    sessionStorage.removeItem("tokenKey");
    sessionStorage.removeItem("userName");
  }

  getShortListOfUsersGroup() {
    this.subscriptionGet = this.groupService.getFirstFiveGroup().subscribe(
      data => { this.groups = data },
      error => { this.alertService.error(error); })
    // console.log(this.groups);
  }

  getShortListOfUser() {
    this.subscriptionGet = this.userService.getShortListUser().subscribe(data => {
      this.users = data;
    },
      error => {
        console.log(error);
      })
  }

  onSubmit(value) {
    console.log(value);
    if (value != "") {
      console.log(value);
      this.userService.getByName(value).subscribe(data => {
        this.users = data;
      },
        error => {
          console.log(error);
        })
    } else {
      this.getShortListOfUser();
    }
  }


  getChatAndRedirect(userId: string) {

    this.chatService.getChatByMemberChat(userId).subscribe(
      data => {
        this.chatId = data;
        //href="/chat/{{chatId}}"+ this.chatId
        this.router.navigate(['/chat/' + this.chatId]);          
      },
      error => { console.log("error") })
  }


  ngOnDestroy() {
    if (this.subscriptionGet != undefined)
      this.subscriptionGet.unsubscribe();
  }

}
