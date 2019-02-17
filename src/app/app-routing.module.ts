import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogsComponent } from './blogs/blogs.component';
import { ChatComponent } from './chat/chat.component';
import { EventsComponent } from './events/events.component';
import { ForbiddenPageComponent } from './forbidden-page/forbidden-page.component';
import { HomeComponent } from './home/home.component';
import { ListOfGroupComponent } from './list-of-group/list-of-group.component';
import { ListOfInvitationComponent } from './list-of-invitation/list-of-invitation.component';
import { ListOfEventComponent } from './list-of-event/list-of-event.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuard } from './_guard/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'blogs/:id', component: BlogsComponent, canActivate: [AuthGuard] },
  { path: 'grouplist', component: ListOfGroupComponent, canActivate: [AuthGuard] },
  { path: 'eventlist', component: ListOfEventComponent, canActivate: [AuthGuard] },
  { path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'invitations', component: ListOfInvitationComponent, canActivate: [AuthGuard] },
  { path: 'events', component: EventsComponent, canActivate: [AuthGuard] },
  { path: 'forbidden', component: ForbiddenPageComponent },
  { path: '**', component: HomeComponent, canActivate: [AuthGuard]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
