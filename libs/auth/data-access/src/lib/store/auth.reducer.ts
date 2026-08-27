import { createFeature, createReducer, on } from '@ngrx/store';
import { login, loginFailure, loginSuccess, logout } from './auth.actions';

export interface AuthState {
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated:
    typeof localStorage !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true',
  error: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(login, (state) => ({ ...state, error: null })),
    on(loginSuccess, (state) => ({
      ...state,
      isAuthenticated: true,
      error: null,
    })),
    on(loginFailure, (state, { error }) => ({
      ...state,
      isAuthenticated: false,
      error,
    })),
    on(logout, () => ({
      isAuthenticated: false,
      error: null,
    })),
  ),
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectIsAuthenticated,
  selectError: selectAuthError,
} = authFeature;