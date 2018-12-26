import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {


  @Input() title: string;
  @Input() message: string;

  constructor(public matDialogRef: MatDialogRef<ConfirmationDialogComponent>) { }

  ngOnInit() {
  }

  accept(){
    this.matDialogRef.close(true);
  }

}
