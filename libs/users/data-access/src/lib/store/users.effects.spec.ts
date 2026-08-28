import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, firstValueFrom, take, throwError } from 'rxjs';
import { ToastService } from 'ui';
import { UsersService } from '../services/users.service';
import {
  addUser,
  addUserFailure,
  addUserSuccess,
  deleteUser,
  deleteUserFailure,
  deleteUserSuccess,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
  loadUsers,
  loadUsersFailure,
  loadUsersSuccess,
} from './users.actions';
import { UsersEffects } from './users.effects';
import { User } from '../models/user.model';

describe('UsersEffects', () => {
  let actions$: Observable<unknown>;
  let effects: UsersEffects;
  let usersService: {
    getUsers: jest.Mock;
    addUser: jest.Mock;
    updateUser: jest.Mock;
    deleteUser: jest.Mock;
  };
  let toast: { show: jest.Mock };
  const user: User = {
    id: 1,
    username: 'jane',
    email: 'jane@example.com',
    jobRole: 'tech',
  };

  beforeEach(() => {
    usersService = {
      getUsers: jest.fn(),
      addUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };
    toast = { show: jest.fn() };
    TestBed.configureTestingModule({
      providers: [
        UsersEffects,
        provideMockActions(() => actions$),
        { provide: UsersService, useValue: usersService },
        { provide: ToastService, useValue: toast },
      ],
    });
    effects = TestBed.inject(UsersEffects);
  });

  it('loads users successfully', async () => {
    usersService.getUsers.mockReturnValue(of([user]));
    actions$ = of(loadUsers());

    await expect(firstValueFrom(effects.loadUsers$.pipe(take(1)))).resolves.toEqual(
      loadUsersSuccess({ users: [user] }),
    );
  });

  it('returns a friendly load failure for an unavailable API', async () => {
    const error = { status: 0 };
    const message = 'Unable to load users. Please check that the API is running and try again.';
    usersService.getUsers.mockReturnValue(throwError(() => error));
    actions$ = of(loadUsers());

    await expect(firstValueFrom(effects.loadUsers$.pipe(take(1)))).resolves.toEqual(
      loadUsersFailure({ error: message }),
    );
  });

  it('adds a user and shows a success toast', async () => {
    usersService.addUser.mockReturnValue(of(user));
    actions$ = of(addUser({ user }));

    await expect(firstValueFrom(effects.addUser$.pipe(take(1)))).resolves.toEqual(
      addUserSuccess({ user }),
    );
    expect(toast.show).toHaveBeenCalledWith('User created successfully.');
  });

  it('returns an add failure and error toast', async () => {
    const error = { status: 0, message: 'Http failure response: 0 Unknown Error' };
    const message = 'Unable to add users. Please check that the API is running and try again.';
    usersService.addUser.mockReturnValue(throwError(() => error));
    actions$ = of(addUser({ user }));

    await expect(firstValueFrom(effects.addUser$.pipe(take(1)))).resolves.toEqual(
      addUserFailure({ error: message }),
    );
    expect(toast.show).toHaveBeenCalledWith(message, 'error');
  });

  it('updates a user', async () => {
    usersService.updateUser.mockReturnValue(of(user));
    actions$ = of(updateUser({ user }));

    await expect(firstValueFrom(effects.updateUser$.pipe(take(1)))).resolves.toEqual(
      updateUserSuccess({ user }),
    );
  });

  it('deletes a user', async () => {
    usersService.deleteUser.mockReturnValue(of(void 0));
    actions$ = of(deleteUser({ id: 1 }));

    await expect(firstValueFrom(effects.deleteUser$.pipe(take(1)))).resolves.toEqual(
      deleteUserSuccess({ id: 1 }),
    );
  });

  it('returns an update failure', async () => {
    usersService.updateUser.mockReturnValue(throwError(() => new Error('Update failed')));
    actions$ = of(updateUser({ user }));

    await expect(firstValueFrom(effects.updateUser$.pipe(take(1)))).resolves.toEqual(
      updateUserFailure({ error: 'Unable to update users. Please try again.' }),
    );
  });

  it('returns a delete failure', async () => {
    usersService.deleteUser.mockReturnValue(throwError(() => new Error('Delete failed')));
    actions$ = of(deleteUser({ id: 1 }));

    await expect(firstValueFrom(effects.deleteUser$.pipe(take(1)))).resolves.toEqual(
      deleteUserFailure({ error: 'Unable to delete users. Please try again.' }),
    );
  });
});