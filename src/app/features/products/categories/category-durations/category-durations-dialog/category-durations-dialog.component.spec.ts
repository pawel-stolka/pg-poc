import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDurationsDialogComponent } from './category-durations-dialog.component';

describe('CategoryDurationsDialogComponent', () => {
  let component: CategoryDurationsDialogComponent;
  let fixture: ComponentFixture<CategoryDurationsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryDurationsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryDurationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
