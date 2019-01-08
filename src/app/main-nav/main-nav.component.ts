import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Chat } from '../model/chat';
import { Group } from '../model/group';
import { User } from '../model/user';
import { CreatechatDialogService } from '../_dialogs/create-chat-dialog/createchat-dialog.service';
import { GroupdialogService } from '../_dialogs/create-group-dialog/groupdialog.service';
import { AlertService } from '../_services/alert.service';
import { ChatService } from '../_services/chat.service';
import { GroupService } from '../_services/group.service';
import { UserService } from '../_services/user.service';


@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
})
export class MainNavComponent {

  subscriptionGet: Subscription;
  subscriptionGetChat: Subscription
  subscriptionGetChats: Subscription

  // @Input() token: string;
  usersGroups: Group[];
  searchForm: FormGroup;
  users: User[];
  user: User;
  currentUserName: string;
  chats: Chat[] = [];
  chat: Chat;
  chatId: number = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
    private groupService: GroupService,
    private alertService: AlertService,
    private userService: UserService,
    private createchatDialogService: CreatechatDialogService,
    private groupdialogService: GroupdialogService,
    private formBuilder: FormBuilder,
    public chatService: ChatService,
    public router: Router) {
  }

  ngOnInit() {
    this.getShortListOfUsersGroup();
    this.getShortListOfUser();
    this.getChatsCreatedByUser();   

    this.chats = this.chatService.usersChatList;
    this.usersGroups = this.groupService.userGroupList;

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
      data => { 
        var tempGroupList = data;
        tempGroupList.forEach(item =>
          this.usersGroups.push(item))
        },
      error => { this.alertService.error(error); })
    // console.log(this.usersGroups);
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
    if (value != "") {
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

    this.subscriptionGetChat = this.chatService.getChatByMemberChat(userId).subscribe(
      data => {
        this.chatId = data;
        //href="/chat/{{chatId}}"+ this.chatId
        this.router.navigate(['/chat/' + this.chatId]);
      },
      error => { console.log("error") })
  }

  createNewChat() {
    this.createchatDialogService.openDialog();
  }

  getChatsCreatedByUser() {
    this.subscriptionGetChats = this.chatService.getChatsCreatedByUser().subscribe(
      data => {
        var tempChatsList = data;
        tempChatsList.forEach(element => {
          this.chats.push(element);
        });
        //this.chats = this.chatService.usersChatList;
      },
      error => { console.log(error) }
    )
  }

  openCreateGroupDialog(){
    this.groupdialogService.openCreateGroupDialog("Creator group", "Write name of group, please");
  }


  ngOnDestroy() {
    if (this.subscriptionGet != undefined)
      this.subscriptionGet.unsubscribe();

    if (this.subscriptionGetChats != undefined)
      this.subscriptionGetChats.unsubscribe();

    if (this.subscriptionGetChat != undefined)
      this.subscriptionGetChat.unsubscribe();
  }

}
