import { Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { login } from 'data-access';
import {
  selectAuthError,
  selectIsAuthenticated,
} from 'data-access';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  readonly errorMessage = this.store.selectSignal(selectAuthError);

  readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      if (this.isAuthenticated()) {
        this.router.navigate(['/users']);
      }
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();

    this.store.dispatch(login({ username, password }));
  }
}