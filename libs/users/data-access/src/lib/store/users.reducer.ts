import { createFeature, createReducer, on } from '@ngrx/store';
import {
  addUser,
  addUserFailure,
  loadUsers,
  loadUsersFailure,
  loadUsersSuccess,
  addUserSuccess,
  deleteUserSuccess,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from './users.actions';
import { User } from '../services/users.service';

export interface UsersState {
  users: User[];
  loading: boolean;
  saving: boolean;
  saveSucceeded: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  saving: false,
  saveSucceeded: false,
  error: null,
};

export const usersFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialState,

    on(loadUsers, (state) => ({
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

    on(addUser, updateUser, (state) => ({
      ...state,
      saving: true,
      saveSucceeded: false,
      error: null,
    })),

    on(addUserSuccess, (state, { user }) => ({
      ...state,
      users: [...state.users, user],
      saving: false,
      saveSucceeded: true,
    })),

    on(addUserFailure, updateUserFailure, (state, { error }) => ({
      ...state,
      saving: false,
      saveSucceeded: false,
      error,
    })),

      on(deleteUserSuccess, (state, { id }) => ({
        ...state,
        users: state.users.filter((user) => user.id !== id),
      })),

    on(updateUserSuccess, (state, { user }) => ({
      ...state,
      saving: false,
      saveSucceeded: true,
      users: state.users.map((currentUser) =>
        currentUser.id === user.id ? user : currentUser,
      ),
    })),
  ),
});

export const {
  name: usersFeatureKey,
  reducer: usersReducer,
  selectUsersState,
  selectUsers,
  selectLoading: selectUsersLoading,
  selectSaving: selectUsersSaving,
  selectSaveSucceeded: selectUsersSaveSucceeded,
  selectError: selectUsersError,
} = usersFeature;

export const selectAllUsers = selectUsers;