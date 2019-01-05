import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfInvitationComponent } from './list-of-invitation.component';

describe('ListOfInvitationComponent', () => {
  let component: ListOfInvitationComponent;
  let fixture: ComponentFixture<ListOfInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfInvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
