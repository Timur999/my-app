import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css']
})
export class EventDialogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  createEventForm: FormGroup;
  image: File;
  loading = false;
  constructor(private fb: FormBuilder,
    public matDialogRef: MatDialogRef<EventDialogComponent>) { }

  ngOnInit() {
    this.createEventForm = this.fb.group({
      eventName: ['', [Validators.required, Validators.maxLength(100)]],
      eventText: ['', [Validators.required, Validators.maxLength(250)]],
      eventDate: ['', Validators.required],
      eventImage: ['']
  })
}

onFileSelected(event) {
  this.image = event.target.files[0];
}

Submit() {
  if (this.createEventForm.valid) {
    this.loading = true;
    this.createEventForm.value.eventImage = this.image
    this.matDialogRef.close(this.createEventForm.value);
  }
}

}
