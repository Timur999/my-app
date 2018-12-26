import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_guard/auth.guard'
import { BlogsComponent } from './blogs/blogs.component'
import { ChatComponent } from './chat/chat.component'

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'blogs/:id', component: BlogsComponent, canActivate: [AuthGuard] },
  { path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
