import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { addUser, updateUser } from 'users-data-access';
import { FeatureUserForm } from './feature-user-form';

describe('FeatureUserForm', () => {
  let component: FeatureUserForm;
  let fixture: ComponentFixture<FeatureUserForm>;
  let store: MockStore;
  let navigate: jest.Mock;
  let routeId: string | null;

  beforeEach(async () => {
    routeId = null;
    await TestBed.configureTestingModule({
      imports: [FeatureUserForm],
      providers: [
        provideMockStore({ initialState: { users: { users: [] } } }),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap(routeId ? { id: routeId } : {}) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureUserForm);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    navigate = jest.spyOn(TestBed.inject(Router), 'navigate');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not submit when required fields are empty', () => {
    const dispatch = jest.spyOn(store, 'dispatch');

    component.submit();

    expect(dispatch).not.toHaveBeenCalled();
    expect(component.userForm.controls.username.touched).toBe(true);
    expect(component.userForm.controls.email.touched).toBe(true);
    expect(component.userForm.controls.jobRole.touched).toBe(true);
  });

  it('does not submit an invalid email address', () => {
    const dispatch = jest.spyOn(store, 'dispatch');
    component.userForm.setValue({
      username: 'jane',
      email: 'not-an-email',
      jobRole: 'tech',
    });

    component.submit();

    expect(dispatch).not.toHaveBeenCalled();
    expect(component.userForm.controls.email.hasError('email')).toBe(true);
  });

  it('dispatches addUser without navigating before the API succeeds', () => {
    const dispatch = jest.spyOn(store, 'dispatch');
    const user = {
      username: 'jane',
      email: 'jane@example.com',
      jobRole: 'tech' as const,
    };
    component.userForm.setValue(user);

    component.submit();

    expect(dispatch).toHaveBeenCalledWith(addUser({ user }));
    expect(navigate).not.toHaveBeenCalled();
  });

  it('does not navigate because of a stale success state before submission', () => {
    store.setState({
      users: { users: [], loading: false, saving: false, saveSucceeded: true, error: null },
    });
    store.refreshState();

    expect(navigate).not.toHaveBeenCalled();
  });

  it('dispatches updateUser in edit mode', async () => {
    routeId = '4';
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [FeatureUserForm],
      providers: [
        provideMockStore({ initialState: { users: { users: [] } } }),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: routeId }) },
          },
        },
      ],
    }).compileComponents();

    const editFixture = TestBed.createComponent(FeatureUserForm);
    const editComponent = editFixture.componentInstance;
    const editStore = TestBed.inject(MockStore);
    navigate = jest.spyOn(TestBed.inject(Router), 'navigate');
    const dispatch = jest.spyOn(editStore, 'dispatch');
    const user = {
      username: 'jane-updated',
      email: 'jane@example.com',
      jobRole: 'qa' as const,
    };
    editComponent.userForm.setValue(user);

    editComponent.submit();

    expect(dispatch).toHaveBeenCalledWith(updateUser({ user: { ...user, id: 4 } }));
    expect(navigate).not.toHaveBeenCalled();
  });
});
