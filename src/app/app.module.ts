import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MaterialModule } from './material';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AlertService } from './_services/alert.service';
import { AuthenticationService } from './_services/authentication.service';
import { UserService } from './_services/user.service';
import { JwtInterceptor } from './_helper/jwt.interceptor';
import { ErrorInterceptor } from './_helper/error.interceptor';
import { AuthGuard } from './_guard/auth.guard';
import { AlertComponent } from './_directives/alert.component';
import { HomeComponent, ModalFormPost } from './home/home.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupService } from './_services/group.service';
import { BlogsComponent } from './blogs/blogs.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './_dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationService } from './_dialogs/confirmation-dialog/confirmation-service.service';
import { ChatComponent } from './chat/chat.component';
import { SignalrService } from './_services/signalr.service';

import { SignalRModule, SignalRConfiguration } from 'ng2-signalr';
import { ForbiddenPageComponent } from './forbidden-page/forbidden-page.component';
import { CreateChatDialogComponent } from './_dialogs/create-chat-dialog/create-chat-dialog.component';
import { CreatechatDialogService } from './_dialogs/create-chat-dialog/createchat-dialog.service';
import { AddNewMemebersToChatDialogComponent } from './_dialogs/add-new-memebers-to-chat-dialog/add-new-memebers-to-chat-dialog.component';


export function createConfig(): SignalRConfiguration {
  const c = new SignalRConfiguration();
  c.hubName = 'NotifyHub';
  c.qs = { user: 'donald' };
  c.url = 'http://localhost:62747';
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
    AddNewMemebersToChatDialogComponent,
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
    ChatComponent, AddNewMemebersToChatDialogComponent,
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
    CreatechatDialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
