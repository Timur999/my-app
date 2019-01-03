import { TestBed } from '@angular/core/testing';

import { CreatechatDialogService } from './createchat-dialog.service';

describe('CreatechatDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreatechatDialogService = TestBed.get(CreatechatDialogService);
    expect(service).toBeTruthy();
  });
});
