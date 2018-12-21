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
import { BlogsComponent, ModalNewPost } from './blogs/blogs.component';
import { MatDialogModule } from '@angular/material/dialog';

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
    ModalNewPost,
    ModalFormPost
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
    MatDialogModule
  ],
  entryComponents: [
    BlogsComponent, ModalNewPost,
    HomeComponent, ModalFormPost
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    GroupService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
