import { createAction, props } from '@ngrx/store';
import { User } from '../services/users.service';

export const loadUsers = createAction('[Users] Load Users');

export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>(),
);

export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: string }>(),
);


export const addUser = createAction(
  '[Users] Add User',
  props<{ user: User }>(),
);

export const addUserSuccess = createAction(
  '[Users] Add User Success',
  props<{ user: User }>(),
);

export const addUserFailure = createAction(
  '[Users] Add User Failure',
  props<{ error: string }>(),
);