import { Component, OnInit } from '@angular/core';
import { PostService } from '../_services/post.service'
import { AlertService } from '../_services/alert.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Post } from '../model/post';
import { first, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { PageEvent } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  subscriptionPost: Subscription;
  subscriptionGet: Subscription;

  postForm: FormGroup;
  post: Post;
  posts: Post[];
  loading = false;
  submitted = false;
  blogId: number = 1;
  userPost: Post;
  pageIndex: number;
  lengthArray: number = 20;
  image: File;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private postService: PostService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private breakpointObserver: BreakpointObserver,
    public matDialog: MatDialog) { }

  ngOnInit() {
    this.postForm = this.formBuilder.group({
      message: ['', Validators.required]
    });

     this.getPostsBelongToGroup(0);
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

  getPostsBelongToGroup(firstPage: number) {
    this.postService.getNextTenPostBelongToGroup(this.blogId, firstPage).subscribe(
      data => {
        this.posts = data;
      },
      error => { this.alertService.error(error) });
  }

  openDialog() {
    const dialogRef = this.matDialog.open(ModalFormPost);

    dialogRef.beforeClose().subscribe(result => {
      if (result != undefined && result != '') {
         //this.subscriptionPost = this.postService.postPost(result.userMessage, 1).pipe(
        this.subscriptionPost = this.postService.postPostMessageAndImage(result, 1).pipe(
          first()).subscribe(
            data => {
              this.posts.push(data);
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

  onFileSelected(event){

    this.image = event.target.files[0];

    this.post = {
     Text : "testImage",
     BlogId : 1
   };

   console.log(event);
 }

 OnSubmit(){
   console.log(this.image);
   this.postService.postPostWithPhoto(this.image).subscribe(data => 
     console.log(data));
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
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalFormPost>) { }

  ngOnInit() {
    this.addPostForm = this.fb.group({
      userMessage: [this.userMessage, [Validators.required, Validators.maxLength(250)]],
      userImage: ['']
    })
  }

  onFileSelected(event){
    this.userImage = event.target.files[0];

    this.post = {
     Text : "testImage",
     BlogId : 1
   };

  // console.log(event);
 }

  Submit() {
    if (this.addPostForm.valid) {
      this.loading = true;
      this.addPostForm.value.userImage = this.userImage
      this.dialogRef.close(this.addPostForm.value);
    }
  }
} 
