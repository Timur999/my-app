import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewMemebersDialogComponent } from './add-new-memebers-dialog.component';

describe('AddNewMemebersToChatDialogComponent', () => {
  let component: AddNewMemebersDialogComponent;
  let fixture: ComponentFixture<AddNewMemebersDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewMemebersDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewMemebersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
