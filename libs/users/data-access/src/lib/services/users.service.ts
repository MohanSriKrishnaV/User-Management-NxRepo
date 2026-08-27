import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api-url.token';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);

  constructor(
    @Inject(API_URL) private apiUrl: string,
  ) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
}