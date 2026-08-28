import { Component, effect, inject, signal } from '@angular/core';

import { Store } from '@ngrx/store';
import {
  User, addUser, loadUsers, selectAllUsers, updateUser,
  selectUsersSaving, selectUsersSaveSucceeded,
} from 'users-data-access';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { logout } from 'data-access';


@Component({
  selector: 'lib-feature-user-form',
  imports: [ReactiveFormsModule, RouterLink,RouterLinkActive],
  templateUrl: './feature-user-form.html',
  styleUrl: './feature-user-form.scss',
})
export class FeatureUserForm {

  
   private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

private readonly formBuilder = inject(FormBuilder); 

 readonly userForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    jobRole: ['tech' as User['jobRole'], Validators.required],
  });

  readonly isEditMode = this.route.snapshot.paramMap.has('id');
  private readonly users = this.store.selectSignal(selectAllUsers);
  readonly saving = this.store.selectSignal(selectUsersSaving);
  private readonly saveSucceeded = this.store.selectSignal(selectUsersSaveSucceeded);
  private readonly saveSubmitted = signal(false);
  private readonly editUserId = Number(this.route.snapshot.paramMap.get('id'));

  constructor() {
    effect(() => {
      if (this.saveSubmitted() && this.saveSucceeded()) {
        this.userForm.reset();
        this.router.navigate(['/users']);
      }
    });

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
    this.saveSubmitted.set(true);
    if (this.isEditMode) {
      this.store.dispatch(updateUser({ user: { ...user, id: this.editUserId } }));
    } else {
      this.store.dispatch(addUser({ user }));
    }

  }

  logout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }

}
