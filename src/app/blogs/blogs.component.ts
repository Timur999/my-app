import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../_services/post.service'
import { AlertService } from '../_services/alert.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Post } from '../model/post';
import { first, map } from 'rxjs/operators';
import { Observable, Subscription, from } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { PageEvent } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationService } from '../_dialogs/confirmation-dialog/confirmation-service.service'
import { Router, ActivatedRoute } from '@angular/router';
import { ModalFormPost } from '../home/home.component'
import { GroupService } from '../_services/group.service';
import { GroupdialogService } from '../_dialogs/create-group-dialog/groupdialog.service';
import { Comment } from '../model/comment'
import { CommentService } from '../_services/comment.service'

// export interface DialogData {
//   text: string;
//   name: string;
//   email: string;
// }

// const COMMENT: Comment[] = [
//   { Id: 1, PostId: 2, SenderName: "Michal", Text: "Nowy komentarz20" },
//   { Id: 2, PostId: 2, SenderName: "Michal", Text: "Nowy komentarz20" },
//   { Id: 3, PostId: 3, SenderName: "Michal", Text: "Nowy komentarz19" },
//   { Id: 4, PostId: 3, SenderName: "Michal", Text: "Nowy komentarz19" },
//   { Id: 5, PostId: 4, SenderName: "Michal", Text: "Nowy komentarz18" },
//   { Id: 6, PostId: 2, SenderName: "Michal", Text: "Nowy komentarz20" },
// ];

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
  SendCommentForm: FormGroup;
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
  isAdminGroup: boolean = false;
  showListOfUserComponent: boolean = false;

  commentsList: Comment[] = [];
  commentMessage: string;
  currentUserName: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private postService: PostService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private breakpointObserver: BreakpointObserver,
    private matDialog: MatDialog,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private groupdialogService: GroupdialogService,
    private commentService: CommentService) { }

  ngOnInit() {
    this.EditPostForm = this.formBuilder.group({
      userMessage: [this.userMessage, [Validators.required, Validators.maxLength(250)]],
      image: ['']
    });

    this.SendCommentForm = this.formBuilder.group({
      commentMessage: [this.commentMessage, [Validators.required, Validators.maxLength(250)]]
    });

    var id = this.route.snapshot.paramMap.get('id');
    this.blogId = Number.parseInt(id);
    this.posts = this.postService.postList;
    this.currentUserName = sessionStorage.getItem("userName");

    this.getPostsBelongToGroup();
    this.getGroupInfo();
    this.getCommentList();
  }

  getGroupInfo() {
    this.groupService.getGroupById(this.blogId).subscribe(
      data => {
        this.isAdminGroup = data.IsAdmin;
      },
      error => { console.log(error + " while get group info") }
    )
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

  getPostsBelongToGroup(firstPage: number = 0) {
    var tempChatsList: Post[] = [];
    this.postService.getNextTenPostBelongToGroup(this.blogId, firstPage).subscribe(
      data => {
        tempChatsList = data;
        tempChatsList.forEach(element => {
          this.posts.push(element);
        });

        //that code define how many post is in this Blog
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
    //Show/Hide edit fields 
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
              this.posts.splice(indexEditPost,1, data);
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

  openDialogAddNewMemberToGroup() {
    console.log(this.blogId);
    this.groupdialogService.openAddNewMemberDialog(this.blogId, "Choose your frends and send invitation")
  }

  openDialogLeaveFromGroup() {
    this.groupdialogService.openConfirmLeaveGroupDialog(this.blogId, "Confirm", "Are you sure?")
  }

  openDialogDeleteGroup() {
    this.groupdialogService.openConfirmDeleteDialog(this.blogId, "Confirm", "Are you sure?");
  }

  showListOfUser() {
    this.showListOfUserComponent = !this.showListOfUserComponent;
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


  ngOnDestroy() {
    if (this.subscriptionPost != undefined)
      this.subscriptionPost.unsubscribe();

    if (this.subscriptionGet != undefined)
      this.subscriptionGet.unsubscribe();
  }

}



