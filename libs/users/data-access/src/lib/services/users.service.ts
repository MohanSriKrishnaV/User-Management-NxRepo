import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api-url.token';

export interface User {
  // id: number;
  name: string;
  email: string;
  // username:string;
  jobRole:'tech' | 'id' | 'gd' | 'qa';
    // 'job-role': 'tech' | 'id' | 'gd' | 'qa';

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

   addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

    updateUser(user: User) {
    return this.http.put<User>(`${this.apiUrl}/${user.email}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}