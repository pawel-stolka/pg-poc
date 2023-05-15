import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDurationsDropdownComponent } from './category-durations-dropdown.component';

describe('CategoryDurationsDropdownComponent', () => {
  let component: CategoryDurationsDropdownComponent;
  let fixture: ComponentFixture<CategoryDurationsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryDurationsDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryDurationsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
