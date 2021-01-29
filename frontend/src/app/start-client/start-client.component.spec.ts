import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartClientComponent } from './start-client.component';

describe('StartClientComponent', () => {
  let component: StartClientComponent;
  let fixture: ComponentFixture<StartClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
