import { Observable, of, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ApiService } from './api.service';
import { Success } from './api.interface';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const { groupId } = environment;

const UserIdKey = 'userId';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private api: ApiService) {}

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem(UserIdKey);
  }

  userId(): string | null {
    return localStorage.getItem(UserIdKey);
  }

  login$({ userName }: { userName: string }): Observable<Success | boolean> {
    if (this.isUserLoggedIn()) {
      console.warn('already logged in');
      return of(false);
    }

    const userId = uuidv4();
    return this.api
      .post<Success>(`groups/${groupId}/users/create`, {
        userId,
        userName,
        iconUrl: '',
      })
      .pipe(
        tap(() => {
          localStorage.setItem(UserIdKey, userId);
        })
      );
  }
}
