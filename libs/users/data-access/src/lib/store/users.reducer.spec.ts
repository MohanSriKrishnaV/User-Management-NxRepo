import {
  addUserSuccess,
  deleteUserSuccess,
  loadUsers,
  loadUsersFailure,
  loadUsersSuccess,
  updateUserSuccess,
} from './users.actions';
import { usersReducer, UsersState } from './users.reducer';
import { User } from '../models/user.model';

describe('usersReducer', () => {
  const firstUser: User = {
    id: 1,
    username: 'jane',
    email: 'jane@example.com',
    jobRole: 'tech',
  };
  const secondUser: User = {
    id: 2,
    username: 'john',
    email: 'john@example.com',
    jobRole: 'qa',
  };
  const initialState: UsersState = {
    users: [],
    loading: false,
    error: null,
  };

  it('sets loading when users are requested', () => {
    expect(usersReducer(initialState, loadUsers())).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('stores loaded users', () => {
    expect(usersReducer(initialState, loadUsersSuccess({ users: [firstUser] }))).toEqual({
      users: [firstUser],
      loading: false,
      error: null,
    });
  });

  it('stores load errors', () => {
    expect(
      usersReducer(initialState, loadUsersFailure({ error: 'Request failed' })),
    ).toEqual({
      ...initialState,
      error: 'Request failed',
    });
  });

  it('adds a created user', () => {
    expect(usersReducer(initialState, addUserSuccess({ user: firstUser })).users).toEqual([
      firstUser,
    ]);
  });

  it('updates the matching user', () => {
    const updatedUser = { ...firstUser, username: 'jane-updated' };
    const state = { ...initialState, users: [firstUser, secondUser] };

    expect(usersReducer(state, updateUserSuccess({ user: updatedUser })).users).toEqual([
      updatedUser,
      secondUser,
    ]);
  });

  it('deletes the matching user', () => {
    const state = { ...initialState, users: [firstUser, secondUser] };

    expect(usersReducer(state, deleteUserSuccess({ id: firstUser.id ?? 0 })).users).toEqual([
      secondUser,
    ]);
  });
});