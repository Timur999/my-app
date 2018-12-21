import { Component, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertService } from '../_services/alert.service';
import { AuthenticationService } from '../_services/authentication.service';
import { GroupService } from '../_services/group.service';
import { Group } from '../model/group';



@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
})
export class MainNavComponent {

  @Input() token: string;
  groups: Group[];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
    private groupService: GroupService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.GetShortListOfUsersGroup();
  }

  Logout() {
    sessionStorage.removeItem("tokenKey");
  }

  GetShortListOfUsersGroup() {
    this.groupService.getFirstFiveGroup().subscribe(
      data => { this.groups = data },
      error => { this.alertService.error(error); })
   // console.log(this.groups);
  }

  Value() {
    this.groupService.getValue().subscribe(
      data => { console.log(data); },
      error => { this.alertService.error(error); })
  }
}
