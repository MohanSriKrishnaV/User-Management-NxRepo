import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
// import { UsersService } from 'users-data-access';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  loadUsers,
  selectAllUsers,
  selectUsersLoading,
  selectUsersError,
  User, addUser,
} from 'users-data-access';
import { logout } from 'data-access';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'lib-feature-user-list',
  imports: [AsyncPipe, JsonPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './feature-user-list.html',
  styleUrl: './feature-user-list.scss',
})
export class FeatureUserList {

  // private readonly usersService = inject(UsersService);
  // readonly users$ = this.usersService.getUsers();

   private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly users$ = this.store.select(selectAllUsers);
  readonly loading$ = this.store.select(selectUsersLoading);
  readonly error$ = this.store.select(selectUsersError);

private readonly formBuilder = inject(FormBuilder); 

 readonly userForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    jobRole: ['tech' as User['jobRole'], Validators.required],
  });

  constructor() {
    this.store.dispatch(loadUsers());
  }

    submit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const user = this.userForm.getRawValue();
    console.log(user);
     this.store.dispatch(addUser({ user }));

    this.userForm.reset();
  }

  logout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}
