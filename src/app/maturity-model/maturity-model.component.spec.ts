import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityModelComponent } from './maturity-model.component';

describe('MaturityModelComponent', () => {
  let component: MaturityModelComponent;
  let fixture: ComponentFixture<MaturityModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturityModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
