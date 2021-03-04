import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaDisplayPartialModelComponent } from './qa-display-partial-model.component';

describe('QaDisplayPartialModelComponent', () => {
  let component: QaDisplayPartialModelComponent;
  let fixture: ComponentFixture<QaDisplayPartialModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QaDisplayPartialModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QaDisplayPartialModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
