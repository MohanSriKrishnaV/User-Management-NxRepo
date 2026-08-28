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

function getUserErrorMessage(error: unknown, operation: string): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    error.status === 0
  ) {
    return `Unable to ${operation} users. Please check that the API is running and try again.`;
  }

  return `Unable to ${operation} users. Please try again.`;
}

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
                error: getUserErrorMessage(error, 'load'),
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
            const message = getUserErrorMessage(error, 'add');
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
            const message = getUserErrorMessage(error, 'delete');
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
            const message = getUserErrorMessage(error, 'update');
            this.toast.show(message, 'error');
            return of(updateUserFailure({ error: message }));
          }),
        ),
      ),
    ),
  );
}