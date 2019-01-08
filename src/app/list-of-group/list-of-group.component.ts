import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Group } from '../model/group';
import { AlertService } from '../_services/alert.service';
import { GroupService } from '../_services/group.service';

@Component({
  selector: 'app-list-of-group',
  templateUrl: './list-of-group.component.html',
  styleUrls: ['./list-of-group.component.css']
})
export class ListOfGroupComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'GroupsName', 'DateOfCreatedGroup', 'IsAdmin', 'IsMember' ];
  dataSource: any;
  groupList: Group[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private groupService: GroupService,
    private alertService: AlertService) { }


  ngOnInit() { 
    this.getAllGroup();
  }

  getAllGroup() {
    this.groupService.getGroupAll().subscribe(
      data => {
        this.groupList = data;
        this.dataSource = new MatTableDataSource<Group>(this.groupList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        this.alertService.error(error);
      }
    )
  }

}
