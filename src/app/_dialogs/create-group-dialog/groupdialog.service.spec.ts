import { TestBed } from '@angular/core/testing';

import { GroupdialogService } from './groupdialog.service';

describe('GroupdialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GroupdialogService = TestBed.get(GroupdialogService);
    expect(service).toBeTruthy();
  });
});
