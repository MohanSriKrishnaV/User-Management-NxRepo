import { Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import {
  User, addUser,
} from 'users-data-access';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { logout } from 'data-access';


@Component({
  selector: 'lib-feature-user-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './feature-user-form.html',
  styleUrl: './feature-user-form.scss',
})
export class FeatureUserForm {

  
   private readonly store = inject(Store);
  private readonly router = inject(Router);

private readonly formBuilder = inject(FormBuilder); 

 readonly userForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    jobRole: ['tech' as User['jobRole'], Validators.required],
  });



     submit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const user = this.userForm.getRawValue();
    this.store.dispatch(addUser({ user }));

    this.userForm.reset();
    this.router.navigate(['/users']);
  }

  logout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }

}
