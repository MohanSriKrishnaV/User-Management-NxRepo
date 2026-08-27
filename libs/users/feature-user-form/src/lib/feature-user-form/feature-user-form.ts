import { Component, effect, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import {
  User, addUser, loadUsers, selectAllUsers, updateUser,
} from 'users-data-access';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { logout } from 'data-access';


@Component({
  selector: 'lib-feature-user-form',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './feature-user-form.html',
  styleUrl: './feature-user-form.scss',
})
export class FeatureUserForm {

  
   private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

private readonly formBuilder = inject(FormBuilder); 

 readonly userForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    jobRole: ['tech' as User['jobRole'], Validators.required],
  });

  readonly isEditMode = this.route.snapshot.paramMap.has('id');
  private readonly users = this.store.selectSignal(selectAllUsers);
  private readonly editUserId = Number(this.route.snapshot.paramMap.get('id'));

  constructor() {
    if (this.isEditMode) {
      this.store.dispatch(loadUsers());
      effect(() => {
        const user = this.users().find((currentUser) => currentUser.id === this.editUserId);
        if (user) {
          this.userForm.patchValue(user);
        }
      });
    }
  }



     submit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const user = this.userForm.getRawValue();
    if (this.isEditMode) {
      this.store.dispatch(updateUser({ user: { ...user, id: this.editUserId } }));
    } else {
      this.store.dispatch(addUser({ user }));
    }

    this.userForm.reset();
    this.router.navigate(['/users']);
  }

  logout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }

}
