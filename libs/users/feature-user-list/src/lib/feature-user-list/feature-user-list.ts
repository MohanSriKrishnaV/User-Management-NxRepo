import { Component, inject } from '@angular/core';
import { UsersService } from 'users-data-access';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'lib-feature-user-list',
  imports: [AsyncPipe],
  templateUrl: './feature-user-list.html',
  styleUrl: './feature-user-list.scss',
})
export class FeatureUserList {

  private readonly usersService = inject(UsersService);
  readonly users$ = this.usersService.getUsers();
}
