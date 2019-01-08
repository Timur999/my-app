import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfGroupComponent } from './list-of-group.component';

describe('ListOfGroupComponent', () => {
  let component: ListOfGroupComponent;
  let fixture: ComponentFixture<ListOfGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
