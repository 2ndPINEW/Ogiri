import { inject } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';

export const loginGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.isUserLoggedIn() ? true : router.parseUrl('/login');
};
