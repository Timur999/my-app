import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service'
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.css']
})
export class CreateGroupDialogComponent implements OnInit {

  createGroupForm: FormGroup;
  loading = false;
  groupName: string;
  newMemberOfGroup: string[] = [];
  userList: User[];

  @Input() title: string;
  @Input() message: string;

  constructor(public matDialogRef: MatDialogRef<CreateGroupDialogComponent>,
    public fb: FormBuilder, 
    public userService: UserService) { }

  ngOnInit() {
    this.createGroupForm = this.fb.group({
      groupName: [this.groupName, [Validators.required, Validators.maxLength(250)]],
      users: ['', Validators.required],
      searchUsername: ['']
    });

    this.onChanges();
    this.getShortListOfUser();
  }

  onChanges() {
    this.createGroupForm.get('searchUsername').valueChanges.subscribe(val => this.onSearch(val))
  }

  onSearch(value) {
    if (value != "") {
      this.userService.getByName(value).subscribe(data => {
        this.userList = data;
      },
        error => {
          console.log(error);
        })
    } else {
      this.userList = []
      this.getShortListOfUser();
    }
  }

  getShortListOfUser() {
    this.userService.getShortListUser().subscribe(data => {
      console.log(data);
      this.userList = data;
    },
      error => {
        console.log(error);
      })
  }

  Submit(){
    if (this.createGroupForm.valid) {
      this.loading = true;
      this.matDialogRef.close(this.createGroupForm.value);
    }
  }
}