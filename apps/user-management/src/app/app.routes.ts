import { Routes } from '@angular/router';
import { Login } from './login/login';
import { authGuard } from './auth/auth.guard';
import { FeatureUserList } from 'feature-user-list';
import { FeatureUserForm } from 'feature-user-form';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'users',
    component: FeatureUserList,
    canActivate: [authGuard],
  },
  {
    path: 'post-users',
    component: FeatureUserForm,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];