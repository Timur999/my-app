import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewMemebersToChatDialogComponent } from './add-new-memebers-to-chat-dialog.component';

describe('AddNewMemebersToChatDialogComponent', () => {
  let component: AddNewMemebersToChatDialogComponent;
  let fixture: ComponentFixture<AddNewMemebersToChatDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewMemebersToChatDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewMemebersToChatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
