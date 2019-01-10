import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignalRConfiguration, SignalRModule } from 'ng2-signalr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlogsComponent } from './blogs/blogs.component';
import { ChatComponent } from './chat/chat.component';
import { EventsComponent } from './events/events.component';
import { ForbiddenPageComponent } from './forbidden-page/forbidden-page.component';
import { GroupsComponent } from './groups/groups.component';
import { HomeComponent, ModalFormPost } from './home/home.component';
import { ListOfInvitationComponent } from './list-of-invitation/list-of-invitation.component';
import { ListOfUserComponent } from './list-of-user/list-of-user.component';
import { LoginComponent } from './login/login.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { MaterialModule } from './material';
import { CompareValidatorDirective } from './shared/compare-validator.directive';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AddNewMemebersDialogComponent } from './_dialogs/add-new-memebers-dialog/add-new-memebers-dialog.component';
import { ConfirmationDialogComponent } from './_dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationService } from './_dialogs/confirmation-dialog/confirmation-service.service';
import { CreateChatDialogComponent } from './_dialogs/create-chat-dialog/create-chat-dialog.component';
import { CreatechatDialogService } from './_dialogs/create-chat-dialog/createchat-dialog.service';
import { CreateGroupDialogComponent } from './_dialogs/create-group-dialog/create-group-dialog.component';
import { EventDialogComponent } from './_dialogs/event-dialog/event-dialog.component';
import { AlertComponent } from './_directives/alert.component';
import { AuthGuard } from './_guard/auth.guard';
import { ErrorInterceptor } from './_helper/error.interceptor';
import { JwtInterceptor } from './_helper/jwt.interceptor';
import { AlertService } from './_services/alert.service';
import { AuthenticationService } from './_services/authentication.service';
import { GroupService } from './_services/group.service';
import { SignalrService } from './_services/signalr.service';
import { UserService } from './_services/user.service';
import { ListOfGroupComponent } from './list-of-group/list-of-group.component';
import { ListOfEventComponent } from './list-of-event/list-of-event.component';



export function createConfig(): SignalRConfiguration {
  const c = new SignalRConfiguration();
  c.hubName = 'NotifyHub';
  // c.qs = { user: 'donald' };
  c.url = 'http://trletsrun.azurewebsites.net';
  c.logging = true;

  // >= v5.0.0
  c.executeEventsInZone = true; // optional, default is true
  c.executeErrorsInZone = false; // optional, default is false
  c.executeStatusChangeInZone = true; // optional, default is true
  return c;
}

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    SignUpComponent,
    LoginComponent,
    AlertComponent,
    HomeComponent,
    GroupsComponent,
    BlogsComponent,
    ModalFormPost,
    ConfirmationDialogComponent,
    ChatComponent,
    ForbiddenPageComponent,
    CreateChatDialogComponent,
    AddNewMemebersDialogComponent,
    CreateGroupDialogComponent,
    ListOfUserComponent,
    ListOfInvitationComponent,
    EventsComponent,
    EventDialogComponent,
    CompareValidatorDirective,
    ListOfGroupComponent,
    ListOfEventComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    SignalRModule.forRoot(createConfig)
  ],
  entryComponents: [
    BlogsComponent, ModalFormPost,
    HomeComponent, ModalFormPost,
    HomeComponent, ConfirmationDialogComponent,
    MainNavComponent, CreateChatDialogComponent,
    ChatComponent, AddNewMemebersDialogComponent,
    HomeComponent, CreateGroupDialogComponent,
    EventsComponent, EventDialogComponent,

  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    GroupService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ConfirmationService,
    SignalrService,
    CreatechatDialogService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
