import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Post } from '../model/post';
import { PostService } from '../_services/post.service';
import { AlertService } from '../_services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


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

  postForm: FormGroup;
  loading = false;
  submitted = false;
  post: Post;
  posts: Post[];
  blogId: number;
  // MatPaginator Output
  pageEvent: PageEvent;
  firstPage: number = 0;
  pageIndex: number;
  lengthArray: number = 20;
  userPostMessage: string;

  text: string;
  name: string;
  email: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private postService: PostService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    var id = this.route.snapshot.paramMap.get('id');
    this.blogId = Number.parseInt(id);
    this.getPostsBelongToGroup(this.firstPage);
    this.postForm = this.formBuilder.group({
      message: ['', Validators.required]
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.postForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.postForm.invalid) {
      return;
    }
    this.loading = true;
    this.subscriptionPost = this.postService.postPost(this.f.message.value, this.blogId).pipe(
      first()).subscribe(
        data => {
          console.log(data);
          this.alertService.success('Successful', true);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      )
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

  isMorePost() {
    // console.log( this.posts.length < this.pageIndex)
    // return this.posts.length < this.pageIndex;
    return true;
  }

  openDialog() {

    const dialogRef = this.dialog.open(ModalNewPost,{
      width: '250px',
      data: {text: this.text, name: this.name, email: this.email }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.text}`);
    });
  }

  ngOnDestroy() {
    this.subscriptionPost.unsubscribe();
    this.subscriptionGet.unsubscribe();
  }
}


@Component({
  selector: 'modal-new-post',
  templateUrl: 'modal-new-post.html',
})
export class ModalNewPost   {

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalNewPost>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  

  // onSubmit(){
  //   console.log("hallo");
  //   if(this.message.invalid){
  //     console.log(this.message.invalid);

  //     return;
  //   }

  // }


  // getErrorMessage(){
  //   return this.message.hasError('required') ? 'You must enter a value' :
  //   this.message.hasError('email') ? 'Not a valid email' :
  //       '';
  // }
}