import { Component, OnInit } from '@angular/core';
import { PostService } from '../_services/post.service'
import { AlertService } from '../_services/alert.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from '../model/post';
import { first, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { PageEvent } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationService } from '../_dialogs/confirmation-dialog/confirmation-service.service'
import { Comment } from '../model/comment'
import { CommentService } from '../_services/comment.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  subscriptionPost: Subscription;
  subscriptionGet: Subscription;
  subscriptionPut: Subscription;

  EditPostForm: FormGroup;
  SendCommentForm: FormGroup;
  userMessage: string;
  post: Post;
  posts: Post[];
  loading = false;
  blogId: number = 1;
  userPost: Post;
  pageIndex: number;
  lengthArray: number;
  image: File;
  editPostId: number;
  currentUserName: string;
  commentMessage: string;
  commentsList: Comment[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(public postService: PostService,
    public formBuilder: FormBuilder,
    public alertService: AlertService,
    public breakpointObserver: BreakpointObserver,
    public matDialog: MatDialog,
    public confirmationService: ConfirmationService,
    public commentService: CommentService) { }

  ngOnInit() {
    this.EditPostForm = this.formBuilder.group({
      userMessage: [this.userMessage, [Validators.required, Validators.maxLength(250)]],
      image: ['']
    });
    this.SendCommentForm = this.formBuilder.group({
      commentMessage: [this.commentMessage, [Validators.required, Validators.maxLength(250)]]
    });

    this.currentUserName = sessionStorage.getItem("userName");
    this.posts = this.postService.postList;

    this.getPostsBelongToGroup(0);
    this.getCommentList();
   }

  nextPageEvent(event) {
    console.log(event.pageIndex)
    this.pageIndex = event.pageIndex;
    this.subscriptionGet = this.postService.getNextTenPostBelongToGroup(this.blogId, event.pageIndex).subscribe(
      data => {
        this.posts.length = 0;
        var tempChatsList = data;
        tempChatsList.forEach(element => {
          this.posts.push(element);
        });
        document.querySelector('.mat-sidenav-content').scrollTop = 0;
      },
      error => { this.alertService.error(error) });
  }

  getPostsBelongToGroup(firstPage: number) {
    this.postService.getNextTenPostBelongToGroup(this.blogId, firstPage).subscribe(
      data => {
        var tempChatsList = data;
        tempChatsList.forEach(element => {
          this.posts.push(element);
        });

        if (this.posts.length > 0) {
          this.lengthArray = this.posts[0].PostCount;
        } else {
          this.lengthArray = 0;
        }
        console.log(data)
      },
      error => { this.alertService.error(error) });
  }

  openDialog() {
    const dialogRef = this.matDialog.open(ModalFormPost);

    dialogRef.beforeClose().subscribe(result => {
      if (result != undefined && result != '') {
        this.subscriptionPost = this.postService.postPostMessageAndImage(result, 1).pipe(
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
    //Show/hide edit fields
    post.isEdit = !post.isEdit
    this.editPostId = post.Id;
  }

  OnSUbmitEditForm(post: Post) {
    if (this.EditPostForm.valid) {
      this.loading = true;
      this.EditPostForm.value.image = this.image;
      this.subscriptionPut =
        this.postService.putPost(this.EditPostForm.value, post.Id)
          .subscribe(
            data => {
              console.log(data);
              var indexEditPost = this.posts.indexOf(post);
              this.posts.splice(indexEditPost, 1, data);
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


  getCommentList() {
    this.commentService.getCommentsByGroup(this.blogId).subscribe(
      data => {
        this.commentsList = data;
        console.log(data)
      },
      error => { console.log(error) }
    );
  }

  OnSubmitSendComment(post: Post) {

    if (this.SendCommentForm.valid) {
      this.loading = true;
      var comment: Comment = {
        BlogId: this.blogId,
        PostId: post.Id,
        SenderName: this.currentUserName,
        Text: this.SendCommentForm.get("commentMessage").value
      }
      console.log(post)
      this.commentService.postComment(comment).subscribe(
        data => {
          this.commentMessage = '';
          this.commentsList.push(comment);
          this.loading = false;
        },
        error => {
          console.log(error)
          this.loading = false;
        }
      );
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

@Component({
  selector: 'modal-form-add-post',
  templateUrl: 'modal-form-add-post.html',
})

export class ModalFormPost implements OnInit {
  addPostForm: FormGroup;
  loading = false;
  post: Post;
  userMessage: string;
  userImage: File;
  constructor(public fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalFormPost>) { }

  ngOnInit() {
    this.addPostForm = this.fb.group({
      userMessage: [this.userMessage, [Validators.required, Validators.maxLength(250)]],
      userImage: ['']
    })
  }

  onFileSelected(event) {
    this.userImage = event.target.files[0];
    this.post = {
      Text: "testImage",
      BlogId: 1
    };
  }

  Submit() {
    if (this.addPostForm.valid) {
      this.loading = true;
      this.addPostForm.value.userImage = this.userImage
      this.dialogRef.close(this.addPostForm.value);
    }
  }
} 
