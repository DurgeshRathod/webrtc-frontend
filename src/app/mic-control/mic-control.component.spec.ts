import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicControlComponent } from './mic-control.component';

describe('MicControlComponent', () => {
  let component: MicControlComponent;
  let fixture: ComponentFixture<MicControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
