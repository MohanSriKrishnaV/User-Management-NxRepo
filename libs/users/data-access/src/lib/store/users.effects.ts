import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

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
        catchError((error) =>
          of(
            addUserFailure({
              error: error?.message ?? 'Failed to add user',
            }),
          ),
        ),
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
          catchError((error) =>
            of(
              deleteUserFailure({
                error: error?.message ?? 'Failed to delete user',
              }),
            ),
          ),
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
          catchError((error) =>
            of(
              updateUserFailure({
                error: error?.message ?? 'Failed to update user',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}