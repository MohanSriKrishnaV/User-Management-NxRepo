import { createFeature, createReducer, on } from '@ngrx/store';
import {
  loadUsers,
  loadUsersFailure,
  loadUsersSuccess,addUserSuccess
} from './users.actions';
import { User } from '../services/users.service';

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const usersFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialState,

    on(loadUsers, (state) => ({
      ...state,
      ...state,
      loading: true,
      error: null,
    })),

    on(loadUsersSuccess, (state, { users }) => ({
      ...state,
      users,
      loading: false,
      error: null,
    })),

    on(loadUsersFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(addUserSuccess, (state, { user }) => ({
  ...state,
  users: [...state.users, user],
})),
  ),
});

export const {
  name: usersFeatureKey,
  reducer: usersReducer,
  selectUsersState,
  selectUsers,
  selectLoading: selectUsersLoading,
  selectError: selectUsersError,
} = usersFeature;

export const selectAllUsers = selectUsers;