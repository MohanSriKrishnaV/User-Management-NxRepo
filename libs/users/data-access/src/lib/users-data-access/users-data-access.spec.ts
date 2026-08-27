import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersDataAccess } from './users-data-access';

describe('UsersDataAccess', () => {
  let component: UsersDataAccess;
  let fixture: ComponentFixture<UsersDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersDataAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
