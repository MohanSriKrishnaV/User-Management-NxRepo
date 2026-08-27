import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureUserList } from './feature-user-list';

describe('FeatureUserList', () => {
  let component: FeatureUserList;
  let fixture: ComponentFixture<FeatureUserList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureUserList],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureUserList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
