import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../_services/post.service'
import { AlertService } from '../_services/alert.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Post } from '../model/post';
import { first, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { PageEvent } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationService } from '../_dialogs/confirmation-dialog/confirmation-service.service'
import { Router, ActivatedRoute } from '@angular/router';
import { ModalFormPost } from '../home/home.component'
import { ChatService } from '../_services/chat.service';

export interface DialogData {
  text: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],

})

export class BlogsComponent implements OnInit, OnDestroy {

  subscriptionPost: Subscription;
  subscriptionGet: Subscription;
  subscriptionPut: Subscription;

  EditPostForm: FormGroup;
  userMessage: string;
  post: Post;
  posts: Post[];
  loading = false;
  blogId: number;
  userPost: Post;
  pageIndex: number;
  lengthArray: number;
  image: File;
  editPostId: number;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private postService: PostService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private breakpointObserver: BreakpointObserver,
    public matDialog: MatDialog,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.EditPostForm = this.formBuilder.group({
      userMessage: [this.userMessage, [Validators.required, Validators.maxLength(250)]],
      image: ['']
    });

    var id = this.route.snapshot.paramMap.get('id');
    this.blogId = Number.parseInt(id);
    this.posts = this.postService.postList;

    this.getPostsBelongToGroup();
  }

  nextPageEvent(event) {
    console.log(event.pageIndex)
    this.pageIndex = event.pageIndex;
    this.subscriptionGet = this.postService.getNextTenPostBelongToGroup(this.blogId, event.pageIndex).subscribe(
      data => {
        this.posts = data;
        document.querySelector('.mat-sidenav-content').scrollTop = 0;
      },
      error => { this.alertService.error(error) });
  }

  getPostsBelongToGroup(firstPage: number = 0) {
    var tempChatsList: Post[] = [];
    this.postService.getNextTenPostBelongToGroup(this.blogId, firstPage).subscribe(
      data => {
        tempChatsList = data;
        tempChatsList.forEach(element => {
          this.posts.push(element);
        });
        // this.posts = data;
        if (this.posts.length > 0) {
          this.lengthArray = this.posts[0].PostCount;
        } else {
          this.lengthArray = 0;
        }
      },
      error => { this.alertService.error(error) });
  }

  openDialog() {
    const dialogRef = this.matDialog.open(ModalFormPost);

    dialogRef.beforeClose().subscribe(result => {
      if (result != undefined && result != '') {
        this.subscriptionPost = this.postService.postPostMessageAndImage(result, this.blogId).pipe(
          first()).subscribe(
            data => {
              // this.posts.push(data);
              console.log(data);
              this.alertService.success("Successful", true);
            },
            error => {
              this.alertService.error(error);
            }
          )
      }
      // console.log(`Dialog result beforeClose: ${result}`)
    })
  }

  onFileSelected(event) {
    this.image = event.target.files[0];
  }

  EditPost(post: Post) {
    console.log(post);
    post.isEdit = !post.isEdit
    this.editPostId = post.Id;
  }

  OnSUbmitEditForm(post: Post) {
    if (this.EditPostForm.valid) {
      this.loading = true;
      console.log("Valid post");
      this.EditPostForm.value.image = this.image;
      this.subscriptionPut =
        this.postService.putPost(this.EditPostForm.value, post.Id)
          .subscribe(
            data => {
              console.log(data);
              this.alertService.success("Successful", true);
              this.loading = false;
              post.isEdit = false;
            },
            error => {
              this.alertService.error(error);
              this.loading = false;
              post.isEdit = false;
            }
          )
    }
  }

  DeletePost(post) {
    this.confirmationService.openConfirmDialog("Confirm", "Are you sure?", post.Id);
  }

  ngOnDestroy() {
    if (this.subscriptionPost != undefined)
      this.subscriptionPost.unsubscribe();

    if (this.subscriptionGet != undefined)
      this.subscriptionGet.unsubscribe();
  }

}
