import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPartialModelComponent } from './display-partial-model.component';

describe('DisplayPartialModelComponent', () => {
  let component: DisplayPartialModelComponent;
  let fixture: ComponentFixture<DisplayPartialModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayPartialModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPartialModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
