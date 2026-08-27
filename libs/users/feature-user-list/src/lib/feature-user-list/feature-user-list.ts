import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
// import { UsersService } from 'users-data-access';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  loadUsers,
  selectAllUsers,
  selectUsersLoading,
  selectUsersError,
  deleteUser,
} from 'users-data-access';
import { logout } from 'data-access';



@Component({
  selector: 'lib-feature-user-list',
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
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
  readonly pendingDeleteUserId = signal<number | null>(null);

  constructor() {
    this.store.dispatch(loadUsers());
  }

  logout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }

  requestDelete(userId: number | undefined): void {
    if (userId === undefined) {
      return;
    }

    this.pendingDeleteUserId.set(userId);
  }

  confirmDelete(): void {
    const userId = this.pendingDeleteUserId();
    if (userId === null) {
      return;
    }

    this.store.dispatch(deleteUser({ id: userId }));
    this.pendingDeleteUserId.set(null);
  }

  cancelDelete(): void {
    this.pendingDeleteUserId.set(null);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancelDelete();
    }
  }
}
