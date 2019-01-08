import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfEventComponent } from './list-of-event.component';

describe('ListOfEventComponent', () => {
  let component: ListOfEventComponent;
  let fixture: ComponentFixture<ListOfEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
