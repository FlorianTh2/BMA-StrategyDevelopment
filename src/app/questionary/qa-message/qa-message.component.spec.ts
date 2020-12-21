import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaMessageComponent } from './qa-message.component';

describe('QaMessageComponent', () => {
  let component: QaMessageComponent;
  let fixture: ComponentFixture<QaMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QaMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QaMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
