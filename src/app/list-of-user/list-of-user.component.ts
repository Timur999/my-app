import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { User } from '../model/user';
import { GroupService } from '../_services/group.service'

@Component({
  selector: 'app-list-of-user',
  templateUrl: './list-of-user.component.html',
  styleUrls: ['./list-of-user.component.css']
})
export class ListOfUserComponent implements OnInit {

  @Input() blogId: number;
  users: User[] = [];
  displayedColumns: string[] = ['Position', 'UserName', 'Role'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private groupService: GroupService) { }

  ngOnInit() {
    this.getListOfUserBelongToGroup();
  }

  getListOfUserBelongToGroup() {
    this.groupService.getUsersBelongToGroup(this.blogId).subscribe(
      data => {
        this.users = data;
        var index = 1;
        this.users.forEach(element => {
          element.Position = index++;
        });
        this.dataSource = new MatTableDataSource<User>(this.users);
        this.dataSource.paginator = this.paginator;
      },
      error => { console.log(error) }
    )
  }

  getUserList(): User[] {
    return this.users
  }

}
