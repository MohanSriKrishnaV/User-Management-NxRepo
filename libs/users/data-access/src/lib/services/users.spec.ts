import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { API_URL } from '../api-url.token';
import { UsersService } from './users.service';
import { User } from '../models/user.model';

describe('UsersService', () => {
  let service: UsersService;
  let http: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  const user: User = {
    id: 1,
    username: 'jane',
    email: 'jane@example.com',
    jobRole: 'tech',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: apiUrl },
      ],
    });
    service = TestBed.inject(UsersService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('loads users from the users endpoint', () => {
    service.getUsers().subscribe((users) => expect(users).toEqual([user]));

    const request = http.expectOne(`${apiUrl}/users`);
    expect(request.request.method).toBe('GET');
    request.flush([user]);
  });

  it('creates a user', () => {
    service.addUser(user).subscribe((createdUser) => expect(createdUser).toEqual(user));

    const request = http.expectOne(`${apiUrl}/users`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(user);
    request.flush(user);
  });

  it('updates a user by id', () => {
    service.updateUser(user).subscribe((updatedUser) => expect(updatedUser).toEqual(user));

    const request = http.expectOne(`${apiUrl}/users/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(user);
    request.flush(user);
  });

  it('deletes a user by id', () => {
    service.deleteUser(1).subscribe();

    const request = http.expectOne(`${apiUrl}/users/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
