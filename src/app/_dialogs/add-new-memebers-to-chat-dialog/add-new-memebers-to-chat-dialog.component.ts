import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { User } from 'src/app/model/user';
import { UserService } from '../../_services/user.service'

@Component({
  selector: 'app-add-new-memebers-to-chat-dialog',
  templateUrl: './add-new-memebers-to-chat-dialog.component.html',
  styleUrls: ['./add-new-memebers-to-chat-dialog.component.css']
})
export class AddNewMemebersToChatDialogComponent implements OnInit {

  subscription: Subscription

  addMembersToChatForm: FormGroup;
  userList: User[] = [];
  user: User;
  loading = false;

  constructor(public matDialogRef: MatDialogRef<AddNewMemebersToChatDialogComponent>,
    public fb: FormBuilder,
    public userService: UserService) { }

  ngOnInit() {
    this.addMembersToChatForm = this.fb.group({
      users: ['', Validators.required],
      searchUsername: ['']
    });

    this.getShortListOfUser();
    this.onSearch();
  }


  onSearch() {
    this.addMembersToChatForm.get("searchUsername").valueChanges.subscribe(val => this.searchUserByNam(val));
  }

  searchUserByNam(value) {
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

  getShortListOfUser(){
    this.subscription = this.userService.getShortListUser().subscribe(data => {
      console.log(data);
      this.userList = data;
    },
      error => {
        console.log(error);
      })
  }

  Submit(){
    console.log(this.addMembersToChatForm.valid)
    if (this.addMembersToChatForm.valid) {
      this.loading = true;
      this.matDialogRef.close(this.addMembersToChatForm.value);
    }
  }
}
