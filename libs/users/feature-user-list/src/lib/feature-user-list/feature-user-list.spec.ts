import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter, Router } from '@angular/router';
import { deleteUser, loadUsers } from 'users-data-access';
import { logout } from 'data-access';
import { FeatureUserList } from './feature-user-list';

describe('FeatureUserList', () => {
  let component: FeatureUserList;
  let fixture: ComponentFixture<FeatureUserList>;
  let store: MockStore;
  let navigate: jest.Mock;
  let dispatch: jest.Mock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureUserList],
      providers: [
        provideMockStore({
          initialState: { users: { users: [], loading: false, error: null } },
        }),
        provideRouter([]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatch = jest.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(FeatureUserList);
    component = fixture.componentInstance;
    navigate = jest.spyOn(TestBed.inject(Router), 'navigate');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads users when the directory is created', () => {
    expect(dispatch).toHaveBeenCalledWith(loadUsers());
  });

  it('confirms deletion by dispatching deleteUser', () => {
    component.requestDelete(7);

    component.confirmDelete();

    expect(dispatch).toHaveBeenCalledWith(deleteUser({ id: 7 }));
    expect(component.pendingDeleteUserId()).toBeNull();
  });

  it('cancels deletion when the backdrop is clicked', () => {
    component.requestDelete(7);

    component.onBackdropClick({
      target: 'backdrop',
      currentTarget: 'backdrop',
    } as unknown as MouseEvent);

    expect(component.pendingDeleteUserId()).toBeNull();
  });

  it('logs out and navigates to login', () => {
    component.logout();

    expect(dispatch).toHaveBeenCalledWith(logout());
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
