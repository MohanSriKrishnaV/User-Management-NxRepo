import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ToastService } from 'ui';

import { UsersService } from '../services/users.service';
import {
  loadUsers,
  loadUsersFailure,
  loadUsersSuccess,
  addUser,
  addUserSuccess,
  addUserFailure,
  deleteUser,
  deleteUserSuccess,
  deleteUserFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
} from './users.actions';

@Injectable()
export class UsersEffects {
  private readonly actions$ = inject(Actions);
  private readonly usersService = inject(UsersService);
  private readonly toast = inject(ToastService);

  readonly loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() =>
        this.usersService.getUsers().pipe(
          map((users) => loadUsersSuccess({ users })),
          catchError((error) =>
            of(
              loadUsersFailure({
                error: error?.message ?? 'Failed to load users',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly addUser$ = createEffect(() =>
  this.actions$.pipe(
    ofType(addUser),
    switchMap(({ user }) =>
      this.usersService.addUser(user).pipe(
        map((createdUser) => addUserSuccess({ user: createdUser })),
        tap(() => this.toast.show('User created successfully.')),
          catchError((error) => {
            const message = error?.message ?? 'Failed to add user';
            this.toast.show(message, 'error');
            return of(addUserFailure({ error: message }));
          }),
      ),
    ),
  ),
);

  readonly deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteUser),
      switchMap(({ id }) =>
        this.usersService.deleteUser(id).pipe(
          map(() => deleteUserSuccess({ id })),
          tap(() => this.toast.show('User deleted successfully.')),
          catchError((error) => {
            const message = error?.message ?? 'Failed to delete user';
            this.toast.show(message, 'error');
            return of(deleteUserFailure({ error: message }));
          }),
        ),
      ),
    ),
  );

  readonly updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      switchMap(({ user }) =>
        this.usersService.updateUser(user).pipe(
          map((updatedUser) => updateUserSuccess({ user: updatedUser })),
          tap(() => this.toast.show('User updated successfully.')),
          catchError((error) => {
            const message = error?.message ?? 'Failed to update user';
            this.toast.show(message, 'error');
            return of(updateUserFailure({ error: message }));
          }),
        ),
      ),
    ),
  );
}