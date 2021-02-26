import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectelementPickerCardComponent } from './projectelement-picker-card.component';

describe('ProjectelementPickerCardComponent', () => {
  let component: ProjectelementPickerCardComponent;
  let fixture: ComponentFixture<ProjectelementPickerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectelementPickerCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectelementPickerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
