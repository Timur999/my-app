import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { UserService } from '../../_services/user.service'
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-create-chat-dialog',
  templateUrl: './create-chat-dialog.component.html',
  styleUrls: ['./create-chat-dialog.component.css']
})
export class CreateChatDialogComponent implements OnInit {

  subscription: Subscription

  createChatForm: FormGroup;
  loading = false;
  chatName: string;
  newMemberOfChatList: string[] = [];// = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  userList: User[];

  constructor(public matDialogRef: MatDialogRef<CreateChatDialogComponent>,
    private fb: FormBuilder,
    public userService: UserService) { }

  ngOnInit() {
    this.createChatForm = this.fb.group({
      chatName: [this.chatName, [Validators.required, Validators.maxLength(250)]],
      users: ['', Validators.required],
      searchUsername: ['']
    });

    this.onChanges();
    this.getShortListOfUser();
  }

  onChanges() {
    this.createChatForm.get('searchUsername').valueChanges.subscribe(val => this.onSearch(val))
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
    this.subscription = this.userService.getShortListUser().subscribe(data => {
      console.log(data);
      this.userList = data;
    },
      error => {
        console.log(error);
      })
  }

  Submit(){
    console.log(this.createChatForm.valid)
    if (this.createChatForm.valid) {
      this.loading = true;
      this.matDialogRef.close(this.createChatForm.value);
    }
  }
  
}
