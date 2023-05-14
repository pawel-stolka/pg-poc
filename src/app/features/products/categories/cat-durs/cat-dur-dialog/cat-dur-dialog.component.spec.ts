import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatDurDialogComponent } from './cat-dur-dialog.component';

describe('CatDurDialogComponent', () => {
  let component: CatDurDialogComponent;
  let fixture: ComponentFixture<CatDurDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatDurDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatDurDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
