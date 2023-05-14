import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatDursComponent } from './cat-durs.component';

describe('CatDursComponent', () => {
  let component: CatDursComponent;
  let fixture: ComponentFixture<CatDursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatDursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatDursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
