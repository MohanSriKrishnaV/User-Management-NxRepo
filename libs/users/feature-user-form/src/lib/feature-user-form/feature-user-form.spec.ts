import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureUserForm } from './feature-user-form';

describe('FeatureUserForm', () => {
  let component: FeatureUserForm;
  let fixture: ComponentFixture<FeatureUserForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureUserForm],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureUserForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
