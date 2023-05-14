import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatDurDropdownComponent } from './cat-dur-dropdown.component';

describe('CatDurDropdownComponent', () => {
  let component: CatDurDropdownComponent;
  let fixture: ComponentFixture<CatDurDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatDurDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatDurDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
